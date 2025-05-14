from neo4j import GraphDatabase
import re
import sys

NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "12345678"

def limpiar_texto(texto):
    texto = texto.lower()
    texto = re.sub(r'[áàäâ]', 'a', texto)
    texto = re.sub(r'[éèëê]', 'e', texto)
    texto = re.sub(r'[íìïî]', 'i', texto)
    texto = re.sub(r'[óòöô]', 'o', texto)
    texto = re.sub(r'[úùüû]', 'u', texto)
    texto = re.sub(r'[^\w\s]', '', texto)
    texto = re.sub(r'\s+', ' ', texto).strip()
    return texto

class PCValidator:
    def __init__(self):
        self.driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

    def close(self):
        self.driver.close()

    def obtener_producto_por_nombre(self, nombre_normalizado):
        with self.driver.session() as session:
            result = session.run("""
                MATCH (p:Producto)
                WHERE toLower(p.nombre) = $nombre
                RETURN p.nombre AS nombre, p.categoria AS categoria, elementId(p) AS neo4j_id
            """, nombre=nombre_normalizado)
            records = list(result)
            if not records:
                return None
            return records[0]

    def obtener_caracteristicas(self, nombre_normalizado, tipo_caracteristica):
        with self.driver.session() as session:
            result = session.run("""
                MATCH (p:Producto)-[:TIENE_CARACTERISTICA]->(c:Caracteristica)
                WHERE toLower(p.nombre) = $nombre AND c.tipo = $tipo
                RETURN c.valor AS valor
            """, nombre=nombre_normalizado, tipo=tipo_caracteristica)
            records = list(result)
            return [r["valor"] for r in records] if records else []

    def validar_compatibilidad(self, componentes_nombres):
        normalizados = {nombre: limpiar_texto(nombre) for nombre in componentes_nombres}
        categorias = {}
        for original, normalizado in normalizados.items():
            producto = self.obtener_producto_por_nombre(normalizado)
            if producto:
                categorias[producto["categoria"]] = normalizado
            else:
                print(f"[ERROR] Producto no encontrado en Neo4j: {original}", flush=True)

        errores = []
        detalles = []

        # CPU - Motherboard
        cpu = categorias.get('cpu')
        mb = categorias.get('motherboard')
        if cpu and mb:
            socket_cpu = self.obtener_caracteristicas(cpu, "enchufe")
            socket_mb = self.obtener_caracteristicas(mb, "enchufe")
            if socket_cpu and socket_mb:
                if socket_cpu[0] != socket_mb[0]:
                    errores.append(f"Incompatibilidad CPU-Motherboard: {socket_cpu[0]} vs {socket_mb[0]}")
                else:
                    detalles.append(f"[OK] CPU-Motherboard compatibles: {socket_cpu[0]}")
            else:
                detalles.append("[WARNING] No se pudo validar CPU-Motherboard (datos faltantes).")

        # Motherboard - RAM
        ram = categorias.get('memory')
        if mb and ram:
            ram_max = self.obtener_caracteristicas(mb, "ram maxima")
            if ram_max:
                detalles.append(f"[OK] Motherboard soporta hasta {ram_max[0]} RAM (validación simplificada)")
            else:
                detalles.append("[WARNING] No se pudo validar Motherboard-RAM (datos faltantes).")

        # Motherboard - Case
        case = categorias.get('case')
        if mb and case:
            formato_mb = self.obtener_caracteristicas(mb, "factor de forma")
            soportados = self.obtener_caracteristicas(case, "factores de forma")
            if formato_mb and soportados:
                if formato_mb[0] not in soportados:
                    errores.append(f"Incompatibilidad Motherboard-Case: {formato_mb[0]} no soportado por {soportados}")
                else:
                    detalles.append(f"[OK] Motherboard-Case compatibles: {formato_mb[0]} en {soportados}")
            else:
                detalles.append("[WARNING] No se pudo validar Motherboard-Case (datos faltantes).")

        # GPU - Case
        gpu = categorias.get('gpu')
        if gpu and case:
            long_gpu = self.obtener_caracteristicas(gpu, "longitud")
            max_long_case = self.obtener_caracteristicas(case, "longitud maxima de gpu")
            if long_gpu and max_long_case:
                if int(long_gpu[0].replace(' mm','')) > int(max_long_case[0].replace(' mm','')):
                    errores.append(f"Incompatibilidad GPU-Case: {long_gpu[0]} > {max_long_case[0]}")
                else:
                    detalles.append(f"[OK] GPU cabe en Case: {long_gpu[0]} <= {max_long_case[0]}")
            else:
                detalles.append("[WARNING] No se pudo validar GPU-Case (datos faltantes).")

        # PSU - CPU/ GPU
        psu = categorias.get('power-supply')
        if psu:
            potencia_psu = self.obtener_caracteristicas(psu, "potencia")
            tdp_cpu = self.obtener_caracteristicas(cpu, "tdp") if cpu else ['0 W']
            tdp_gpu = self.obtener_caracteristicas(gpu, "tdp") if gpu else ['0 W']
            if potencia_psu:
                consumo_estimado = int(tdp_cpu[0].replace(' w','')) + int(tdp_gpu[0].replace(' w','')) + 100
                if int(potencia_psu[0].replace(' w','')) < consumo_estimado:
                    errores.append(f"Incompatibilidad PSU: potencia {potencia_psu[0]}W insuficiente para consumo estimado {consumo_estimado}W")
                else:
                    detalles.append(f"[OK] PSU adecuada: {potencia_psu[0]}W >= {consumo_estimado}W")
            else:
                detalles.append("[WARNING] No se pudo validar PSU (datos faltantes).")

        # Storage - Motherboard
        storage = categorias.get('storage')
        if storage and mb:
            interfaz_storage = self.obtener_caracteristicas(storage, "interfaz")
            puertos_mb = self.obtener_caracteristicas(mb, "puertos sata") + self.obtener_caracteristicas(mb, "puertos m2")
            if interfaz_storage and puertos_mb:
                if interfaz_storage[0] not in puertos_mb:
                    errores.append(f"Incompatibilidad Storage-Motherboard: {interfaz_storage[0]} no soportado")
                else:
                    detalles.append(f"[OK] Storage-Motherboard compatibles: {interfaz_storage[0]} soportado")
            else:
                detalles.append("[WARNING] No se pudo validar Storage-Motherboard (datos faltantes).")

        print("\n[INFO] Detalle de validaciones:", flush=True)
        for detalle in detalles:
            print(detalle, flush=True)

        if errores:
            print("\n[ERROR] Configuración inválida:", flush=True)
            for error in errores:
                print(f" - {error}", flush=True)
        else:
            print("\n[OK] Configuración válida - No se encontraron incompatibilidades.", flush=True)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("[ERROR] No se proporcionaron componentes.", flush=True)
        sys.exit(1)
    componentes = sys.argv[1].split('|')

    print(f"\n[INFO] Componentes introducidos:\n{componentes}", flush=True)
    validador = PCValidator()
    validador.validar_compatibilidad(componentes)
    validador.close()
