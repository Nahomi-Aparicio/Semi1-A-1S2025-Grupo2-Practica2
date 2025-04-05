const { Buffer } = require("buffer");
const gestionesDb = require("../node/acciones_bd"); 

module.exports = async function (context, req) {
    try {
        const { fileContent, fileName } = req.body;

        if (!fileContent || !fileName) {
            context.res = { status: 400, body: "Faltan datos requeridos." };
            return;
        }

        const buffer = Buffer.from(fileContent, "base64");
        context.bindings.outputBlob = buffer;

        const usuarioId = await gestionesDb.obtenerUsuarioLogeado();
        if (!usuarioId) {
            context.res = { status: 401, body: "Usuario no autenticado" };
            return;
        }

        const storageAccountName = "p2semi1a1s2025archivosg2";
        const containerName = "practica2semi1a1s2025archivosg2";
        const fileUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${fileName}`;

        const ok = await gestionesDb.cargarArchivo(
            usuarioId,
            fileName,
            "documento",
            fileUrl
        );

        if (!ok) throw new Error("No se pudo guardar el documento en la base de datos.");

        context.res = {
            status: 200,
            body: { message: "Documento subido con éxito", fileUrl }
        };
    } catch (error) {
        context.log(error.message);
        context.res = { status: 500, body: error.message };
    }
};
