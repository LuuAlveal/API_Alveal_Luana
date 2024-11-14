const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser')
const bodyP = bodyParser.json()
const app = express();
app.use(bodyP); 
const port = 3000;

const leerDatos = () => { //Funcion para leer datos de la base de datos
    try{ 
        const datos = fs.readFileSync ("./datos.json");
        return JSON.parse(datos); 
    }
    catch{
        console.log(error);
    }
}
const escribir = (datos) => { //Funcion que escribe datos de la base de datos
    try{ 
        fs.writeFileSync("./datos.json", JSON.stringify(datos))
    }
    catch{
        console.log(error);
    }
}

//PRODUCTOS
//MUESTRA TODOS LOS PRODUCTOS
app.get('/ListarProductos', (req, res) => { 
    const datos = leerDatos();
    res.json(datos.productos)
});
// BUSCAR PRODUCTO POR SU CODIGO
app.get('/BuscarProducto/:codigo', (req, res) => {
    const datos = leerDatos();
    const codigo = parseInt(req.params.codigo) 
    const producto = datos.productos.find((producto) => producto.codigo === codigo);
    if(producto){
        res.json(producto)
    }else{
        res.status(404).send("No existe ese producto");
    }
});
// ACTUALIZAR STOCK DEL PRODUCTO 
app.put('/ActualizarProducto/:codigo', (req,res) => {
    const datos = leerDatos();
    const body = req.body;
    const codigo = parseInt(req.params.codigo)
    const buscarIndex = datos.productos.findIndex((producto) => producto.codigo === codigo);
    datos.productos[buscarIndex]={
        ...datos.productos[buscarIndex],
        ...body,
    };
    escribir(datos);
    res.json({message: "Producto Actualizado"})
});
// ELIMINAR PRODUCTO
app.delete('/EliminarProducto/:codigo', (req,res)=>{
    const datos = leerDatos();
    const codigo = parseInt(req.params.codigo);
    const producto = datos.productos.find((productos) => productos.codigoProducto === codigo);
    if (producto) {
        let estado = producto.estado;
        if (estado === "INACTIVO") {
            producto.estado = "ACTIVO"
        }
        else {
            producto.estado = "INACTIVO"
        }
        escribir(datos);
        res.json({ message: `${producto.nombre} ${producto.estado}` });
    }
    else {
        res.status(500).send("No existe ese producto");
    }
});
// CARGAR PRODUCTO
app.post('/SubirProducto', (req, res) => {
    const datos = leerDatos();
    let productos = datos.productos;
    let nuevoProductoCodigo;
    if (productos.length > 0) { 
        nuevoProductoCodigo = productos[productos.length - 1].codigoProducto + 1; 
    }
    else { 
        nuevoProductoCodigo = 1; 
    }
    const body = req.body;
    const nuevoProducto = {
        codigoProducto: nuevoProductoCodigo,
        ...body,
        nombre: "",
        dniProveedor: 0,
        stock: 0,
        precio: 0 
    };
    datos.productos.push(nuevoProducto);
    escribir(datos); 
    res.json(nuevoProducto); 
});

//PROVEEDORES
//MUESTRA TODOS LOS PROVEEDORES
app.get('/ListarProveedores', (req, res) => {
    const datos = leerDatos();
    res.json(datos.proveedores)
});
// BUSCAR PROVEEDORES POR SU DNI
app.get('/BuscarProveedor/:dni', (req, res) => {
    const datos = leerDatos();
    const dni = parseInt(req.params.dni) 
    const proveedor = datos.proveedores.find((proveedor) => proveedor.dni === dni);
    if(proveedor){
        res.json(proveedor)
    }else{
        res.status(404).send("No existe ese proveedor");
    }
});
// ACTUALIZAR PROVEEDOR
app.put('/ActualizarProveedor/:dni', (req,res) => {
    const datos = leerDatos();
    const body = req.body;
    const dni = parseInt(req.params.dni)
    const buscarIndex = datos.proveedores.findIndex((proveedor) => proveedor.dni === dni);
    datos.proveedores[buscarIndex]={
        ...datos.proveedores[buscarIndex],
        ...body,
    };
    escribir(datos);
    res.json({message: "Proveedor Actualizado"})
});
// ELIMINAR PROVEEDORES
app.delete('/EliminarProveedor/:dni', (req,res)=>{
    const datos = leerDatos();
    const dni = parseInt(req.params.dni);
    const proveedor = datos.proveedores.find((proveedores) => proveedores.dniProveedor === dni);
    if (proveedor) {
        let estado = proveedor.estado;
        if (estado === "INACTIVO") {
            proveedor.estado = "ACTIVO"
        }
        else {
            proveedor.estado = "INACTIVO"
        }
        escribir(datos);
        res.json({ message: `${proveedor.nombre} ${proveedor.estado}` });
    }
    else {
        res.status(500).send("No existe ese proveedor");
    }
});
// NUEVO PROVEEDOR
app.post('/NuevoProveedor', (req, res) => {
    const datos = leerDatos();
    let proveedores = datos.proveedores;
    const body = req.body;
    const nuevoDni = proveedores.find(proveedor => proveedor.dni === body.dni);
    if (nuevoDni) { 
        return res.status(400).send({ message: "Proveedor existente" });
    }
    const nuevoProveedor = {
        ...body
    };
    datos.proveedores.push(nuevoProveedor);
    escribir(datos);
    res.json(nuevoProveedor);
});

//CLIENTES
//MUESTRA TODOS LOS CLIENTES
app.get('/ListarClientes', (req, res) => {
    const datos = leerDatos();
    res.json(datos.clientes)
});
// BUSCAR CLIENTES POR SU DNI
app.get('/BuscarCliente/:dni', (req, res) => {
    const datos = leerDatos();
    const dni = parseInt(req.params.dni) 
    const cliente = datos.clientes.find((Cliente) => cliente.dni === dni);
    if(cliente){
        res.json(cliente)
    }else{
        res.status(404).send("No existe ese cliente");
    }
});
// ACTUALIZAR CLIENTE
app.put('/ActualizarCliente/:dni', (req,res) => {
    const datos = leerDatos();
    const body = req.body;
    const dni = parseInt(req.params.dni)
    const buscarIndex = datos.clientes.findIndex((cliente) => cliente.dni === dni);
    datos.clientes[buscarIndex]={
        ...datos.clientes[buscarIndex],
        ...body,
    };
    escribir(datos);
    res.json({message: "Cliente Actualizado"})
});
// NUEVO CLIENTE
app.post('/NuevoCliente', (req, res) => {
    const datos = leerDatos();
    let clientes = datos.clientes;
    const body = req.body;
    const nuevoDni = clientes.find(cliente => cliente.dni === body.dni);
    if (nuevoDni) { 
        return res.status(400).send({ message: "Cliente existente" });
    }
    const nuevoCliente = {
        ...body
    };
    datos.clientes.push(nuevoCliente);
    escribir(datos);
    res.json(nuevoCliente);
});

//VENDEDORES
//MUESTRA TODOS LOS VENDEDORES
app.get('/ListarVendedores', (req, res) => {
    const datos = leerDatos();
    res.json(datos.vendedores)
});
// BUSCAR VENDEDORES POR SU ID
app.get('/BuscarVendedor/:id', (req, res) => {
    const datos = leerDatos();
    const id = parseInt(req.params.id) 
    const vendedor = datos.vendedores.find((vendedor) => vendedor.id === id);
    if(vendedor){
        res.json(vendedor)
    }else{
        res.status(404).send("No existe ese vendedor");
    }
});
// FILTRAR VENDEDORES POR SECTOR
app.get('/BuscarVendedor/:sector', (req, res) => {
    const datos = leerDatos();
    const sector = parseInt(req.params.sector) 
    const vendedor = datos.vendedores.find((vendedor) => vendedor.sector === sector);
    if(vendedor){
        res.json(vendedor)
    }else{
        res.status(404).send("No existe ese sector");
    }
});
// ACTUALIZAR VENDEDOR
app.put('/ActualizarVendedor/:id', (req,res) => {
    const datos = leerDatos();
    const body = req.body;
    const id = parseInt(req.params.id)
    const buscarIndex = datos.vendedores.findIndex((vendedor) => vendedor.id === id);
    datos.vendedores[buscarIndex]={
        ...datos.vendedores[buscarIndex],
        ...body,
    };
    escribir(datos);
    res.json({message: "Vendedor Actualizado"})
});
// NUEVO VENDEDOR
app.post('/NuevoVendedor', (req, res) => {
    const datos = leerDatos();
    let vendedores = datos.vendedores;
    const body = req.body;
    const nuevoId = vendedores.find(vendedor => vendedor.id === body.id);
    if (nuevoId) { 
        return res.status(400).send({ message: "Vendedor existente" });
    }
    const nuevoVendedor = {
        ...body
    };
    datos.vendedores.push(nuevoVendedor);
    escribir(datos);
    res.json(nuevoVendedor);
});
// ELIMINAR VENDEDOR
app.delete('/EliminarVendedor/:id', (req,res)=>{
    const datos = leerDatos();
    const id = parseInt(req.params.id);
    const vendedor = datos.vendedores.find((vendedores) => vendedores.idVendedor === id);
    if (vendedor) {
        let estado = vendedor.estado;
        if (estado === "INACTIVO") {
            vendedor.estado = "ACTIVO"
        }
        else {
            vendedor.estado = "INACTIVO"
        }
        escribir(datos);
        res.json({ message: `${vendedor.nombre} ${vendedor.estado}` });
    }
    else {
        res.status(500).send("No existe ese vendedor");
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});