class Usuario {
    constructor(nomeUsuario, senhaUsuario) {
        this.nomeUsuario = nomeUsuario
        this.senhaUsuario = senhaUsuario
        this.recados = []
    }

    static importarJSON(usuarioJSON) {
        let usuarioImportado = new Usuario(usuarioJSON.nomeUsuario, usuarioJSON.senhaUsuario)
        usuarioImportado.recados = usuarioJSON.recados
        return usuarioImportado
    }

    testarSenha(senhaUsuarioDigitada) {
        if (this.senhaUsuario == senhaUsuarioDigitada) {
            return true
        }
        else {
            return false
        }
    }

    adicionarRecado(descricao, detalhamento) {
        let novoRecado = { "descricao": descricao, "detalhamento": detalhamento }
        this.recados.push(novoRecado)
    }

    removerRecado(idRecadoRemover) {
        this.recados.splice(idRecadoRemover, 1)
    }

    editarRecado(idRecadoEditar, novaDescricao, novoDetalhamento) {
        this.recados[idRecadoEditar].descricao = novaDescricao
        this.recados[idRecadoEditar].detalhamento = novoDetalhamento
    }

    visualizarRecado(idRecadoVisualizar) {
        return this.recados[idRecadoVisualizar]
    }
    visualizarTodosRecados() {
        return this.recados
    }
}

class BancoUsuarios {
    constructor(chaveBancoUsuarios) {
        this.chave = chaveBancoUsuarios
        this.usuarios = []
    }

    carregarBancoUsuarios() {
        let bancoUsuariosNoLocalStorage = JSON.parse(localStorage.getItem(this.chave))
        if (bancoUsuariosNoLocalStorage != null) {
            for (let usuarioJSON of bancoUsuariosNoLocalStorage) {
                let usuarioImportado = Usuario.importarJSON(usuarioJSON)
                this.usuarios.push(usuarioImportado)
            }
        }
        else {
            this.usuarios = []
        }
    }

    salvarBancoUsuarios() {
        localStorage.setItem(this.chave, JSON.stringify(this.usuarios))
    }

    usuarioDisponivel(nomeUsuario) {
        if (this.usuarios.find(usuario => usuario.nomeUsuario == nomeUsuario)) return false
        else return true
    }

    criarUsuario(nomeUsuario, senhaUsuario, senhaUsuarioRepetida) {
        if ((nomeUsuario != "") && (this.usuarioDisponivel(nomeUsuario))) {
            if (senhaUsuario == senhaUsuarioRepetida) {
                let novoUsuario = new Usuario(nomeUsuario, senhaUsuario)
                this.usuarios.push(novoUsuario)
                this.salvarBancoUsuarios()
                return "criado"
            }
            else {
                return "senhaRepetida"
            }
        }
        else {
            return "usuarioExiste"
        }
    }

    acharUsuario(nomeUsuarioProcurado) {
        return this.usuarios.find(usuario => (usuario.nomeUsuario == nomeUsuarioProcurado))
    }

    logonNoUsuario(nomeUsuarioDigitada, senhaUsuarioDigitada) {
        let usuario = this.usuarios.find(usuario => usuario.nomeUsuario == nomeUsuarioDigitada)
        return usuario.testarSenha(senhaUsuarioDigitada)
    }

    adicionarRecadoNoUsuario(nomeUsuarioDestino, descricaoNovoRecado, detalhamentoNovoRecado) {
        this.acharUsuario(nomeUsuarioDestino).adicionarRecado(descricaoNovoRecado, detalhamentoNovoRecado)
        this.salvarBancoUsuarios()
    }

    editarRecadoNoUsuario(nomeUsuarioDestino, idRecadoEditar, descricaoEditar, detalhamentoEditar) {
        let usuario = this.acharUsuario(nomeUsuarioDestino)
        usuario.editarRecado(idRecadoEditar, descricaoEditar, detalhamentoEditar)
        this.salvarBancoUsuarios()
    }

    removerRecadoNoUsuario(nomeUsuarioDestino, idRecadoRemover) {
        this.acharUsuario(nomeUsuarioDestino).removerRecado(idRecadoRemover)
        this.salvarBancoUsuarios()
    }

    visualizarRecadoNoUsuario(nomeUsuarioVisualizar, idRecadoVisualizar) {
        return this.acharUsuario(nomeUsuarioVisualizar).visualizarRecado(idRecadoVisualizar)
    }
    visualizarTodosRecadosNoUsuario(nomeUsuarioVisualizar) {
        return this.acharUsuario(nomeUsuarioVisualizar).visualizarTodosRecados()
    }
}

class SistemaRecados {
    constructor(nomeSistema, chaveBancoUsuarios) {
        this.nomeSistema = nomeSistema
        this.campoAlertaSenha = document.getElementById("alertaSenha")
        this.campoAlertaUsuario = document.getElementById("alertaUsuario")
        this.campoAlertaUsuarioSenha = document.getElementById("alertaUsuarioSenha")
        this.bancoUsuarios = new BancoUsuarios(chaveBancoUsuarios)
    }

    iniciaSistemaRecados() {
        this.bancoUsuarios.carregarBancoUsuarios()
        this.usuarioLogado = localStorage.getItem("usuarioSessaoRecados")
        if (document.title == "Sistema de Recados") {
            if ((this.usuarioLogado != null)) {

                this.geraListaRecados()
            }
            else {
                window.location.href = "./entrada.html";
            }
        }
    }

    tentarFazerLogon() {
        let campoUsuario = document.getElementById("campoUsuario").value
        let campoSenha = document.getElementById("campoSenha").value
        if (this.bancoUsuarios.acharUsuario(campoUsuario) && (campoUsuario != "")) {
            if (this.bancoUsuarios.logonNoUsuario(campoUsuario, campoSenha)) {
                this.usuarioLogado = campoUsuario
                localStorage.setItem("usuarioSessaoRecados", campoUsuario)
                window.location.href = "./gerenciador.html";
            }
            else this.displayAlertaPagina("senhaIncorreta")
        }
        else this.displayAlertaPagina("usuarioIncorreto")
    }

    fazerLogoff() {
        localStorage.removeItem("usuarioSessaoRecados")
        window.location.href = "./entrada.html";
    }

    tentaCriarContaUsuario() {
        let campoUsuario = document.getElementById("campoUsuario").value
        let campoSenha = document.getElementById("campoSenha").value
        let campoRepeteSenha = document.getElementById("campoRepeteSenha").value
        this.displayAlertaPagina("reset")
        let tentativa = this.bancoUsuarios.criarUsuario(campoUsuario, campoSenha, campoRepeteSenha)
        this.displayAlertaPagina(tentativa)
        if (tentativa == "criado") {
            window.location.href = "./entrada.html";
        }
    }

    salvarNovoRecadoNoUsuario() {
        let descricaoRecadoSalvar = document.getElementById("campoDescricaoEntrada").value
        let detalhamentoRecadoSalvar = document.getElementById("campoDetalhamentoEntrada").value
        if ((descricaoRecadoSalvar != "") && (detalhamentoRecadoSalvar != "")) {
            this.bancoUsuarios.adicionarRecadoNoUsuario(this.usuarioLogado, descricaoRecadoSalvar, detalhamentoRecadoSalvar)
        }
        this.geraListaRecados()
    }

    displayAlertaPagina(alerta) {
        if (alerta == "usuarioExiste") {
            this.campoAlertaUsuario.innerHTML = "Este usuário já existe."
        }
        if (alerta == "senhaRepetida") {
            this.campoAlertaSenha.innerHTML = "As senhas não conferem."
        }
        if (alerta == "criado") {
            alert("Usuário criado com sucesso.")
        }
        if (alerta == "reset") {
            this.campoAlertaSenha.innerHTML = ""
            this.campoAlertaUsuario.innerHTML = ""
        }
        if (alerta == "usuarioIncorreto") {
            this.campoAlertaUsuarioSenha.innerHTML = "O usuário está incorreto."
        }
        if (alerta == "senhaIncorreta") {
            this.campoAlertaUsuarioSenha.innerHTML = "A senha está incorreta."
        }
    }

    geraListaRecados() {
        let tableBody = document.getElementById("listaRecados")
        let conteudoTableBody = ""
        let bancoRecados = this.bancoUsuarios.visualizarTodosRecadosNoUsuario(this.usuarioLogado)
        for (let id in bancoRecados) {
            let conteudoLinha = `<tr>
            <th scope="row">${id}</th>
            <td class="col-2">${bancoRecados[id].descricao}</td>
            <td class="col-7">
                ${bancoRecados[id].detalhamento}</td>
            <td class="col-2">
                <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalEditar"
                    onclick="${this.nomeSistema}.gerarModalEdicao(${id})">Editar</button>
                <button class="btn btn-danger" data-bs-toggle="modal"
                    data-bs-target="#modalExcluir" onclick="${this.nomeSistema}.gerarModalExclusao(${id})">Excluir</button>
            </td>
        </tr>`
            conteudoTableBody += conteudoLinha
        }
        tableBody.innerHTML = conteudoTableBody
    }

    gerarModalEdicao(idRecadoEditar) {
        let modalEdicao = document.getElementById('modalEditar')
        let recado = this.bancoUsuarios.visualizarRecadoNoUsuario(this.usuarioLogado, idRecadoEditar)
        modalEdicao.setAttribute("data-bs-idRecado", idRecadoEditar)
        let modalCampoDescricao = document.getElementById("modalEditarDescricaoRecado")
        modalCampoDescricao.value = recado.descricao
        let modalCampoDetalhamento = document.getElementById("modalEditarDetalhamentoRecado")
        modalCampoDetalhamento.value = recado.detalhamento
    }

    gerarModalExclusao(idRecadoExcluir) {
        let modalExclusao = document.getElementById('modalExcluir')
        let recado = this.bancoUsuarios.visualizarRecadoNoUsuario(this.usuarioLogado, idRecadoExcluir)
        modalExclusao.setAttribute("data-bs-idRecado", idRecadoExcluir)
        let modalCampoDescricao = document.getElementById("modalExcluirDescricaoRecado")
        modalCampoDescricao.innerHTML = recado.descricao
        let modalCampoDetalhamento = document.getElementById("modalExcluirDetalhamentoRecado")
        modalCampoDetalhamento.innerHTML = recado.detalhamento
    }

    salvarModalEditar() {
        let modalEditar = document.getElementById('modalEditar')
        let valorDescricaoModal = document.getElementById("modalEditarDescricaoRecado").value
        let valorDetalhamentoModal = document.getElementById("modalEditarDetalhamentoRecado").value
        let idRecadoEditar = modalEditar.getAttribute("data-bs-idRecado")
        this.bancoUsuarios.editarRecadoNoUsuario(this.usuarioLogado, idRecadoEditar, valorDescricaoModal, valorDetalhamentoModal)
        this.geraListaRecados()
        this.bancoUsuarios.salvarBancoUsuarios()
    }

    salvarModalExcluir() {
        var modalExcluir = document.getElementById('modalExcluir')
        let idRecadoExcluir = modalExcluir.getAttribute("data-bs-idRecado")
        this.bancoUsuarios.removerRecadoNoUsuario(this.usuarioLogado, idRecadoExcluir)
        this.bancoUsuarios.salvarBancoUsuarios()
        this.geraListaRecados()
    }
}

var sistemaRecados = new SistemaRecados("sistemaRecados", "NovoTesteNovoBanco")
sistemaRecados.iniciaSistemaRecados()