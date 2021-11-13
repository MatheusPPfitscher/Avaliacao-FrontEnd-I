// NECESSARIO COLOCAR ISSO EM sistemaRecados.js
// module.exports = {
//     Usuario,
//     BancoUsuarios
// }

const util = require('util')

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
function displayAlertaPagina(alerta) {
    console.log(alerta)
}

global.document = new JSDOM('').window.document;

const { Usuario, BancoUsuarios } = require('./sistemaRecados')

console.log("Teste instanciar Usuario, testar senha correta/incorreta, adicionar 2 recados,\
     alterar 1 recado, remover 1 recado")
testeUsuario = new Usuario("matheus", "123456")
console.log(testeUsuario.testarSenha("123456"))
console.log(testeUsuario.testarSenha("1234567"))
testeUsuario.adicionarRecado("Comprinhas na Shopee", "Você deveria fazer mais delas.")
testeUsuario.adicionarRecado("Vendinhas na OLX", "Você deveria vender mais coisas.")
console.log("Visão do Objeto com os recados adicionados")
console.log(util.inspect(testeUsuario, { showHidden: false, depth: null, colors: true }))
console.log("Retornar recados")
console.log(testeUsuario.visualizarTodosRecados())
console.log("Alterando recado 1")
testeUsuario.editarRecado(1, "Vendas da OLX", "Você já fez algumas")
console.log("Removendo recado 1")
testeUsuario.removerRecado(1)
console.log("Visão do Objeto após remoção e edição")
console.log(util.inspect(testeUsuario, { showHidden: false, depth: null, colors: true }))

console.log(
    "Teste instanciar Usuario, adicionar recado, exportar e importar JSON, instanciar apartir do JSON")
testeUsuarioParaImportar = new Usuario("matheus", "123456")
testeUsuarioParaImportar.adicionarRecado("Comprinhas na Shopee", "Você deveria fazer mais delas.")
localStorage.setItem("testeUsuarioParaImportar", JSON.stringify(testeUsuarioParaImportar))
testeUsuarioJSONImportado = JSON.parse(localStorage.getItem("testeUsuarioParaImportar"))
console.log("Visão do Objeto importado do LocalStorage em JSON")
console.log(util.inspect(testeUsuarioJSONImportado, { showHidden: false, depth: null, colors: true }))
testeUsuarioImportado = Usuario.importarJSON(testeUsuarioJSONImportado)
console.log("Visão do Objeto após o método static importarJSON")
console.log(util.inspect(testeUsuarioImportado, { showHidden: false, depth: null, colors: true }))

console.log("Teste instanciar banco de Usuario, adicionar 2 usuarios, testar criar mesmo usuario,\
testar logon correto e incorreto, adicionar 2 recados, editar, remover recado")
testeBancoUsuario = new BancoUsuarios("TesteBanco")
testeBancoUsuario.criarUsuario("matheus", "123456", "123456")
testeBancoUsuario.criarUsuario("Petry", "Pfitscher", "Pfitscher")
testeBancoUsuario.criarUsuario("matheus", "123456", "123456")
console.log(testeBancoUsuario.logonNoUsuario("matheus", "123456"))
console.log(testeBancoUsuario.logonNoUsuario("matheus", "1234567"))
testeBancoUsuario.adicionarRecadoNoUsuario("matheus", "JavaScript é: ", "Uma longa visita ao inferno.")
testeBancoUsuario.adicionarRecadoNoUsuario("matheus", "Mal podemos esperar...", "Pelo inferno que será node.js!")
console.log("Visão do Objeto com usuarios e recados criados")
console.log(util.inspect(testeBancoUsuario, { showHidden: false, depth: null, colors: true }))
console.log("Retornando recados")
console.log(testeBancoUsuario.visualizarTodosRecadosNoUsuario("matheus"))
console.log("Editando recado 1")
testeBancoUsuario.editarRecadoNoUsuario("matheus", 0, "Já estamos esperando...", "pelas maravilhas do backend.")
testeBancoUsuario.removerRecadoNoUsuario("matheus", 1)
console.log("Visão do Objeto com recados editados e removidos")
console.log(util.inspect(testeBancoUsuario, { showHidden: false, depth: null, colors: true }))

console.log("Teste instancia banco de Usuario, adicionar 1 usuario, adicionar 1 recado,\
salvar e carregar do LocalStorage")
testeBancoUsuarioParaImportar = new BancoUsuarios("testeBancoUsuarioParaImportar", "TesteBancoImportar")
testeBancoUsuarioParaImportar.criarUsuario("mathuziel", "12345", "12345")
testeBancoUsuarioParaImportar.adicionarRecadoNoUsuario("mathuziel", "Este é seu: ", "Nome na Steam.")
console.log("Visão do Objeto antes da importação do LocalStorage")
console.log(util.inspect(testeBancoUsuarioParaImportar, { showHidden: false, depth: null, colors: true }))
testeBancoUsuarioParaImportar.salvarBancoUsuarios()
testeBancoUsuarioImportado = new BancoUsuarios("testeBancoUsuarioParaImportar", "TesteBancoImportar")
testeBancoUsuarioImportado.carregarBancoUsuarios()
console.log("Visão do Objeto após uma importação do LocalStorage")
console.log(util.inspect(testeBancoUsuarioImportado, { showHidden: false, depth: null, colors: true }))