class Despeza {
    constructor(ano, mes, dia, tipo,descricao,valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao =descricao
        this.valor = valor
    }
    validarDados(){
        
       for(let i in this){
           //verificar se todos os campos foram preenchidos
           if(this[i] == undefined || this[i] == '' || this[i] == null ){
               return false;
           }
       }
       return true 
    }
}

class Bd {
    constructor(){
        let id = localStorage.getItem('id')

        //se id for null, seta valor 0
        if(id === null){
            localStorage.setItem('id', 0)
        }
    }
    getProximoId(){
        //pega o id e adiciona +1
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    
    }
    gravar(despeza){ 
         
       let id = this.getProximoId()
        //transforma objeto em JSON
        localStorage.setItem(id, JSON.stringify(despeza))
        //seta o valor do LocalStorage com Id
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){

        let despesas = Array()
        // recupera o os id de getItem do Storage
        let id =localStorage.getItem('id')

        //pega todos os id do storage
        for(let i=1; i<=id; i++){
            //transforma JSON em Objeto
            let despesa = JSON.parse(localStorage.getItem(i))
            
            //pular indices que é null
            if(despesa === null){
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa){
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()

        //ano
        if(despesa.ano != ''){
            despesasFiltradas =  despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //mes
        if(despesa.mes != ''){
            despesasFiltradas =  despesasFiltradas.filter(d => d.mes == despesa.mes)
           }
        //dia
        if(despesa.dia != ''){
            despesasFiltradas =  despesasFiltradas.filter(d => d.dia == despesa.dia)
           }
        //tipo
        if(despesa.tipo != ''){
            despesasFiltradas =  despesasFiltradas.filter(d => d.tipo == despesa.tipo)
           }
        //descricao
        if(despesa.descricao != ''){
            despesasFiltradas =  despesasFiltradas.filter(d => d.descricao == despesa.descricao)
           }
        //valor
        if(despesa.valor != ''){
            despesasFiltradas =  despesasFiltradas.filter(d => d.valor == despesa.valor)
           }
           return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa() {
  //seleciona cada valor do campo
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo');    
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');

    //chama despesa passando seus valores
    let despesa = new Despeza(
        ano.value, 
        mes.value, 
        dia.value, 
        tipo.value,
        descricao.value,
        valor.value
    )
    
    if(despesa.validarDados()){
        //grava no storage e altera o modal do bootstrap
        bd.gravar(despesa)
        document.getElementById('modal_titulo').innerHTML ='Registro inserido com sucesso'
        document.getElementById('modal_titulo_div').className = 'modal-header text=success'
        document.getElementById('modal-body').innerHTML = 'Mano, adicionei tua divida'
        document.getElementById('modal-btn'). className = 'btn btn-success';
        document.getElementById('modal-btn').innerHTML = 'Voltar'
      
        $('#registraDespeza').modal('show')
        ano.value = '';
        mes.value = '';
        dia.value = '';
        tipo.value = '';
        descricao.value = '';
        valor.value = '';
    } else{
        document.getElementById('modal_titulo').innerHTML ='Deu erro mano, foi mal'
        document.getElementById('modal_titulo_div').className = 'modal-header text=danger'
        document.getElementById('modal-body').innerHTML = 'Mano, verifica se tu preencheu tudo'
        document.getElementById('modal-btn'). className = 'btn btn-danger';
        document.getElementById('modal-btn').innerHTML = 'Voltar e corrigir'

        $('#registraDespeza').modal('show')
    }
}

function carregaListaDespeza(despesas = Array(), filtro = false){

    if(despesas.length == 0 && filtro == false){

    
    despesas = bd.recuperarTodosRegistros()
}
//selecionando tbody da table
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ""
    //percorrer array despesa, listando despesas
    despesas.forEach((d) =>{
        
        //criando tr
        let linha = listaDespesas.insertRow()

        //criando td
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        //ajustando tipo 
        switch(d.tipo){
            case '1': d.tipo= 'Alimentação'
                break
            case '2': d.tipo= 'Educação'
                break
            case '3': d.tipo= 'Lazer'
                break
            case '4': d.tipo= 'Saúde'
                break
            case '5': d.tipo= 'Educação'
                break            
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = `R$ ${d.valor}`

        //botao exclusão
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = 'id_despesa_'+d.id
        btn.onclick = function(){
            

            let id = this.id.replace('id_despesa_', '')
            
            bd.remover(id)

            window.location.reload()
        }
        linha.insertCell(4).append(btn)
    })
}

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes  = document.getElementById('mes').value
    let dia  = document.getElementById('dia').value
    let tipo  = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despeza(ano, mes, dia, tipo,descricao,valor)
    let despesas = bd.pesquisar(despesa)

    this.carregaListaDespeza(despesas, true)
}