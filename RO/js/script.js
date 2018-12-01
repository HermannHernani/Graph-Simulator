﻿//================== Logica do phaser		
var game = new Phaser.Game(900, 500, Phaser.CANVAS, 'phaser-id',
 { preload: preload, create: create, update: update, render:render});
// usando objetos ele altera valor do atributo
class A{
	constructor(an){
		this.an= an;
		this.an.a = '1';
	}
}
var as = {a:0};
af = new A(as);
console.log(as);

//========== teste acima
class Grafo{
	
	constructor(quantidadePoints){
		this.infinito = Number.MAX_SAFE_INTEGER;
		this.lengthVertices = quantidadePoints;
		this.enlaces = {};
		this.inicializarGrafo();
	}
	Infinito(){
		return this.infinito;
	}
	inicializarGrafo(){
		this.matrizADJ = [];
		for(var i=0;i< this.lengthVertices;i++){
	        let linha=[];
	        this.matrizADJ.push(linha);
	        for(var j=0;j<this.lengthVertices;j++){
	        this.matrizADJ[i].push(this.infinito);//se tem ou nao ligação
	        }
    	}
	}
	setConfigInit(dataLinhasPontos, limiteOndas){
		this.limiteOndas= limiteOndas;
		for( let k=0; k < dataLinhasPontos.length; k++ ){
			this.setMatrizAdj( dataLinhasPontos[k] );
			this.criarEnlaces( dataLinhasPontos[k] );
		}
	}
	setMatrizAdj(dataLinhaPontos){
		var u = dataLinhaPontos.u -1;
		var v = dataLinhaPontos.v -1;
		var peso  = dataLinhaPontos.peso;
		this.matrizADJ[ u ][ v ] =parseInt( peso );
	    this.matrizADJ[ v ][ u ] =parseInt( peso );
	}
	criarEnlaces( enlace ){
		var u = enlace.u;
		var v = enlace.v;
		if (u> v){
			var t =u;u=v;v=t; 
		}
		this.enlaces[Grafo.toParCode(u,v)]= ( this.criarEnlance( u, v, enlace.peso ) );
	}
	criarEnlance(u,v,peso){
		var ondas = [];
		for( let i=1;i<= this.limiteOndas; i++){
			var onda = { onda:"y"+i,
						 tempoReserva:0,
						 isReservado:function(){
						 	return tempoReserva !=0;
						 },
						 updateReserva: function(tempoDecorrido){
						 	this.tempoReserva -= tempoDecorrido;
				 			if( this.tempoReserva < 0 ) {
				 				this.tempoReserva = 0;
				 			}
						 },
						 reservar: function(tempo){
						 	this.tempoReserva = tempo;
						 }
						};
			ondas.push(onda);
		}
		return { u:u,
				 v:v,
				 peso:peso,
				 ondasReservadas: ondas,
				 atualizaReserva: function(tempoDecorrido){//testar isso aqui usando foreach
				 	for(let i =0; i < this.ondasReservadas.length; i++){
				 		this.ondasReservadas[i].updateReserva( tempoDecorrido) ;
				 	}
				 },
				 atualizaReserva2: function(tempoDecorrido){//testar isso aqui usando foreach
				 	ondasReservadas.foreach(
				 		function(element, index, array){
				 			element.updateReserva( tempoDecorrido) ;
				 		} );
				 		
				 },
				 isOndaDisponivel: function(onda){
				 	return this.ondasReservadas[onda].isReservado();
				 },
				 reservar: function(onda,tempo){
				 	this.ondasReservadas[onda].reservar(tempo);
				 }
				};
	}
	isEnlaceDisponivel(u,v, onda){
		var is= true;
		var cod = Grafo.toParCode(u,v);
		if( this.enlaces[ cod ] != null ){
			is = this.enlaces[ cod ].isOndaDisponivel(onda);
		}else{
			is = false;
		}
		return is;
	}
	reservarEnlace(u,v,onda,tempo){
		var cod = Grafo.toParCode(u,v);
		this.enlaces[ cod ].reservar(onda,tempo);
	}
	static toParCode(u,v){
		if (u>v){
			var t =u; u=v; v=t;
		}
		return ""+u+""+v;
	}
}
//criar funcao de menor caminho otico
class GraphAlgoritms{
	constructor(grafo){
		this.infinito = grafo.Infinito();
		this.graph = grafo;
	}
	menorCaminho(origem,destino){
		
		var saida =  this.menorCaminho_init(origem,destino);
		return saida;
	}
	menorCaminho_init(origem,destino){
		this.saida = [];
		this.caminho = [];
	    var distancias = [];
	    var visitados = [];
	    var conj = [];
	    var adj=[];
		
		var vertices= this.graph.lengthVertices;
	    for(var i =0;i< vertices; i++){
	        distancias.push(this.infinito );
	        visitados.push(false);
	    }

	    this.caminho.push(origem);
	    distancias[origem-1] = 0;
	    conj.unshift(origem-1);
		var u =  origem-1;

		this.menorCaminho_loop(u,destino,distancias,conj,visitados);

		var str_saida={
			vetorDistacia: distancias,
			custoPercusso:distancias[destino-1],
			percusso: JSON.stringify(this.saida)
		}; 
		
		return str_saida;
	}
	menorCaminho_loop(u,fim,distancias,conj,visitados){
		var u=  conj.pop();

		if(visitados[u]==false){
			visitados[u]=true;
			var adj = this.graph.matrizADJ[u];
			for(var i =0;i<adj.length;i++){
				var v= i;
				//nesta verificação, vc tbm verifica se há caminho disponível
				if(this.graph.matrizADJ[u][v] != this.infinito ){
					if(distancias[v] > distancias[u]+this.graph.matrizADJ[u][v]){

						distancias[v]= distancias[u]+this.graph.matrizADJ[u][v];//atualiza
						conj.unshift( v );
						if( !this.atualizarCaminho(v,fim) ){
							this.menorCaminho_loop(v,fim,distancias,conj,visitados);
						}
						this.caminho.pop();
						visitados[v]=false;
					}
				}
			}
		}
	}
	//TODO
	isEnlaceDisponivel(onda_y){

	}

	atualizarCaminho(v,fim){
		this.caminho.push(v+1);
		if ( this.caminho[this.caminho.length-1] == fim){
			this.saida=[];
			for ( var i=0; i< this.caminho.length; i++){
				this.saida.push(this.caminho[i]);
			}
			return true;
		}
		return false;
	}
}
//Talves essa funcção deva estar dentro de uma classe Redes Oticas//ultima prioridade
function criarGrafoChamadas(quantidadeChamadas,ondas){
	rd = new RedesOticas(points, dataLinhasPontos, quantidadeChamadas, ondas);
	console.log(rd);
	console.log("simulando cenario de RD");
	console.log(rd.simularCenario());
}
//== no futuro passar tudo para duas classes
class RedesOticas{
	constructor(points, dataLinhasPontos, quantidade,ondasLim){
		this.points = points;
		this.limiteOndas= ondasLim;
		this.dataLinhasPontos = dataLinhasPontos;
		this.quantidadeChamadas = quantidade;
		this.calls = {};
	}
	simularCenario(){
		this.grafoOtico = new Grafo(this.points.length);
		this.grafoOtico.setConfigInit(this.dataLinhasPontos, this.limiteOndas );
		this.calls = Chamadas.gerarChamadas(this.quantidadeChamadas, this.points.length);
		this.calls.realizarVerificoes( this.grafoOtico );
		return this.calls;
	}
	
}

class Chamadas{
	constructor(quantidade){
    	this.quantidade = quantidade;
    	this.buscas = [];
    	this.verificacoes = [];
	}
	getIndexChamada(u,v){
    	var disponivel= -1;
    	var code = Grafo.toParCode(u,v);
    	for (var i=0; i< this.buscas.length && disponivel== -1 ;i++){
    		if( this.buscas[i].par == code ){
    			disponivel= i;
    		}
    	}
    	return disponivel;
    }
    realizarVerificoes( grafo ){
    	var graphAlgoritms = new GraphAlgoritms( grafo );
    	for( let i =0;i < this.quantidade;i++){

			var u = this.verificacoes[i].u;
			var v = this.verificacoes[i].v;
			if (i != 0){
				//TODO: se não for primeiro, CALCULA TEMPO DE PROXIMA CHAMADA
				//TODO: atualiza todos enlances;
			}
			var r = graphAlgoritms.menorCaminho( u, v );
			//TODO: calcular aqui o tempo de chamada
			//TODO: reservar aqui cada enlace do caminho na onda y com tempo tal
			//TODO: Isso se o retorno não retornou bloqueio ne.
			this.verificacoes[i].setData( r.percusso, r.custoPercusso);
			let indiceCall =  this.getIndexChamada(u,v);
			//adicionar na busca o tempo alocado
			this.buscas[indiceCall].addCaminho( r.percusso, r.custoPercusso);
		}
		return this.verificacoes;
    }
    //TODO:CRIAR AQUI o tempo RANDOM
    static gerarRandomPar(limite){
		var u = getRandomInt(1, limite);
		var v = getRandomInt(1, limite);
		while (u==v){
			var v = getRandomInt(1, limite);
		}
		if (u>v){
			var t =u; u=v; v=t;
		}
		return {u:u,v:v};
    }
    static gerarChamadas(quantidade, totalPontos){
	
	    var chamadas = new Chamadas(quantidade);
		for(var i=1;i<=quantidade;i++ ){
			var par = Chamadas.gerarRandomPar(totalPontos);
			var u = par.u;
			var v = par.v;
			let j = chamadas.getIndexChamada(u,v);
			if( j == -1){
				var chamada = new BuscaChamada(u,v);
				chamadas.buscas.push(chamada);
			}
			else {
				chamadas.buscas[j].solicitacao ++;
			}

			var verificacao = new VerificacaoChamada(u,v);
			chamadas.verificacoes.push(verificacao);
		}
		return chamadas;
	}
    // criar function static de gerarChamadas
}
class BuscaChamada{
	constructor(u,v){
		this.par=""+u+"-"+v,
		this.u = u;
		this.v = v;
		this.caminhos = [/*{class caminho}*/];
		this.solicitacao = 1;
	}
	prob_Erro(){
		return this.caminhos.length/this.solicitacao;
	}
	isBuscado(rota){
		var buscado = false;
		for (let i=0; i< this.caminhos.length && !buscado;i++){
			buscado = this.caminhos[i].equals(rota);
		}
		return buscado;
	}
	addCaminho(rota,distancia){
		var caminho = new Caminho(rota,distancia);
		this.caminhos.push(caminho);
	}
}
class VerificacaoChamada{
	constructor(u,v){
		this.par=""+u+"-"+v,
		this.u = u;
		this.v = v;
		this.caminho = "";
		this.distancia=-1;
	}
	setData(caminho,distancia){
		this.caminho = caminho;
		this.distancia = distancia;
	}
}
class Caminho{
	constructor(rota,distancia){
		this.rota = rota;
		this.distancia = distancia;
	}
	equals(rota){
		return this.rota.localeCompare(rota)==0;
	}
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


//================== Logica do phaser		

function preload() {
    game.load.spritesheet('centroid', 'img/balls.png', 17, 17);
    game.load.spritesheet('button', 'img/button.png', 80, 20);
}
//grafo
var points = [];
var adjPesos = [];
var dataLinhasPontos=[];
var peso='';
//phaser
var overTap = false;
var currentPoint;
var centroid;
var enterKey;
var connection = 0;
var makeLine = false;
var enterStop;
var style;
var flag=false;
//projeto
var show=1;
var etapa = {
	fase: 0, em_execucao:0
}

//Configuração de teclas de entrada de dados
function config_buttons(){
	//config teclas
	enterStop = game.input.keyboard.addKey(Phaser.Keyboard.S);
	spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
}

// funções de atualização
function create() {
	style ={font: "20px Arial",
		fill: "green",
        align: "center"
	} ;
	style_verticetxt ={font: "20px Courier",
		color: "YELLOWGREEN",
        align: "center"
	} ;
	game.stage.backgroundColor = '#808080';
	config_buttons();
	currentPoint = game.add.image(10, 10, 'centroid');
	currentPoint.anchor.set(0.5);
	currentPoint.alpha = 0.9;
	game.input.onTap.add(onTapHandler, this);
	
}
function update() {
    
    switch ( etapa.fase ){
    	case 0:
    		setInputTap(false);
    		game.paused = true;
    		saved= dataSaved();
    		if( saved ){
    			setDataLinhasPontos();
    		}
    		if ( etapa.em_execucao==0 ){
    			verificacaoInicial();
    			etapa.em_execucao = 1;
    		}
    		break;
    	case 1:
    	if(!spaceKey.isDown){
    		currentPoint.position.copyFrom(game.input.activePointer.position);
		}
		else{			
			setInputTap(false);
	        etapa.fase=2;
			etapa.em_execucao = 0;	
		}
		break;
		case 2:
		  if ( etapa.em_execucao == 1  && enterStop.isDown){
		  	etapa.em_execucao = 0;
			etapa.fase = 3;
			flag=true;
			salvarEstagio();
			show=1;
		  }
		  if (enterKey.isDown){
        	etapa.em_execucao = 1;
		  }

		  if ( etapa.em_execucao ){
		  	connectLine();
		  }
		  break;
		case 3:
			var formCall = document.getElementById("formCall").style.visibility = "visible";
			break;
		default:
		//console.log("saindo da faixa de fase");
	}
}
function render(){
	//adiciona indicie a bolinha
    var index=1;
    points.forEach(function(child) {
        game.debug.text(index, child.x - 10,child.y + 25, style_verticetxt.color,style_verticetxt.font);
        index+=1;
    });
    exibirLinhas();
}
function exibirLinhas(){
	if(makeLine){

        //setar um peso exatamento no meio da distancia entre os pontos
	    for(var i=0;i< dataLinhasPontos.length;i++){
	    	var p1Point  = getPoint(dataLinhasPontos[i].u);
	    	var p2Point  = getPoint(dataLinhasPontos[i].v);
			//atualiza linha
	    	dataLinhasPontos[i].linha.fromSprite( p1Point, p2Point );
	    	//adiciona linha no game
	    	game.debug.geom(dataLinhasPontos[i].linha);

			var mx = ( p1Point.x + p2Point.x )/2;
			var my = ( p1Point.y + p2Point.y )/2;
	        game.debug.text( dataLinhasPontos[i].peso, mx,my, "white", "20px Courier" );
	    }

    }
}

//Adiciona pontos na tela
function onTapHandler(pointer, doubleTap) {
    if (!overTap)
    {
        img = createImg(game.input.activePointer.position.x, game.input.activePointer.position.y,points.length+1);
        points.push(img);
    }
}
function createImg(x,y, id){
	var img = game.add.sprite(x, y, 'centroid', 0);        
        img.anchor.set(0.5);
        img.alpha = 0.7;
        img.inputEnabled = true;
        img.input.enableDrag(true);
        img.defaultCursor = "move";
        img.indice = id;
     return img;
}
function inicarParPoint(){
	var aux = {
				u:0,
				v:0,
				peso:0,
				ocupado:0,
				linha:{},
				getjson:function(){
					var saveObject = {};
					saveObject.u = this.u;
					saveObject.v = this.v;
					saveObject.peso = this.peso;
					return JSON.stringify(saveObject);
				}
			};
	return  aux;
}
function configParPoint(idP1,idP2, peso){
	var aux = inicarParPoint();
	aux.u = idP1;
	aux.v = idP2;
    var p1Point  = getPoint(idP1);
    var p2Point  = getPoint(idP2);
	line = new Phaser.Line( p1Point.x, p1Point.y, p2Point.x, p2Point.y);
	aux.peso = peso;
	aux.linha = line;
	return aux;
}

function connectLine() {
   
    for(var i=0;i<points.length;i++){
       
        if(this.connection<2){
            
            points[i].events.onInputDown.add(getPoints, this,points[i]);
        }else{
			//TODO::DÁ PRA TRANSFORMAR ISSO AQUI NUMA ESTRUTURA MELHOR
            //aux.push(adjPesos[0]);//adjPesos é um vetor[2] que guarda o id do ponto escolhido
            //aux.push(adjPesos[1]);
            var selection ;
            do{
    			selection = parseInt(prompt("Please enter a number from 1 to 100", "peso"), 10);
			}while(isNaN(selection) || selection > 100 || selection < 1);
			peso = selection;
            
            aux = configParPoint(adjPesos[0],adjPesos[1],peso);
            dataLinhasPontos.push(aux);//guarda as arestas  com infor de origem,destino e peso            
            makeLine=true;
			resetFindParPoint();
        }
    }
}
function resetFindParPoint(){
		this.connection=0;
		adjPesos = [];
		peso = '';
}
function getPoint(id){
	return points[id-1];
}
function getPoints (point) {
  
   adjPesos.push(points.indexOf(point)+1);
   this.connection+=1;
}
function setDataLinhasPontos(){
	setInputTap(false);
	makeLine = true;
	etapa.fase = 3;
	game.paused = false;
}
function getStart(){
	etapa.fase++;
	setInputTap(true);
	game.paused = false;
}
function setInputTap(pode){
	currentPoint.visible= pode;
	currentPoint.inputEnabled = pode;
	overTap= !pode;
}

//==================== Salvar layout
function salvarEstagio(){
	save = {"grafo":{
	points: points.map(function (point){
			var saveObject = {};
			saveObject.x = point.x;
			saveObject.y = point.y;
			saveObject.indice = point.indice;
			return saveObject;//JSON.stringify(saveObject);
		}),
		dataLinhasPontos:dataLinhasPontos.map(function(adj){
			return adj;//adj.getjson();
		})
	}};
    salvar(JSON.stringify(save));
}
function salvar(obj) {

		let titulo = "graph";
		var data = new Date();
		var dia     = data.getDate();            
		var mes     = data.getMonth();          
		var ano4    = data.getFullYear(); 
		var str_data = ano4 + '-' + (mes+1) + '-' + dia;
		titulo+= str_data;
		var blob = new Blob([obj], { type: "text/plain;charset=utf-8" });
		saveAs(blob, titulo + ".txt");
}

// leitura de arquivo =======================
function fileSelect(files) {
    var f = files[0]; // FileList object
    var output = [];
    
    if (f != null){
    	var leitor = new FileReader();
		leitor.onload = leCSV;
		leitor.readAsText(f);
    }	
    function leCSV(evt) {
		var fileArr = evt.target.result;
		console.log(result);
		var saveObject = JSON.parse(fileArr).grafo; 
		window.window.location.href="simulador.html";
		sessionStorage.setItem('graph_simulatorSave', JSON.stringify(saveObject));
	}
}

function dataSaved(){
		var data = sessionStorage.getItem('graph_simulatorSave');
		sessionStorage.removeItem('graph_simulatorSave');
		saveObject = JSON.parse(data);
		if( saveObject != null ){
			criarPontos(saveObject);
			criarDataPoints(saveObject);
			return true;
			//setDataLinhasPontos();
		}
		else return false;		
}

function criarPontos(saveObject){
	this.points = [];
	for( let i=0;i<saveObject.points.length;i++ ){
		var img = createImg(saveObject.points[i].x, saveObject.points[i].y, saveObject.points[i].indice);
    	this.points.push(img);
	}
}
function criarDataPoints(saveObject){
	this.dataLinhasPontos = [];
	for( let i=0;i<saveObject.dataLinhasPontos.length; i++ ){
		data = saveObject.dataLinhasPontos[i];
		aux = configParPoint(data.u,data.v,data.peso);
		this.dataLinhasPontos.push(aux);
	}
}

//====================== verificações de API
function verificacaoInicial(){
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  // Great success! All the File APIs are supported.
	} else {
	  alert('The File APIs are not fully supported in this browser.');
	}
}

// ===================== FUNÇÕES DE APOIO DO PROJETO ===== QUE PODEM SER MUDADO
function ajuda(){
	show = 1;
	projeto();
}
function projeto(){
	if(show ==1){
		show++;
		if(etapa.fase ==1){
			alert("Coloque os pontos clicando."+"\n"+"Para encerrar a inserção de pontos aperte a tecla \"space\".");
		}
		if(etapa.fase ==2){
			
			alert("\n\nPara começar a inserir as arestas aperte a tecla \"enter\" :"+
			"\nDiga o valor do peso e clique nos dois vertices que deseja criar a aresta."+
			"\n\nPara encerrar,aperte a tecla \"s\".");
		}
	}
}

// FUNÇÕES CHAVE DE EXECUÇÃO DO PROJETO
function callMeBaby(){
	var calls = document.getElementById("quantidadeCall").value;
	var ondas = document.getElementById("quantidadeOnda").value;
	quantidade = parseInt( calls );
	if( quantidade>=1 &&  quantidade<=1000){
		criarGrafoChamadas(quantidade,ondas);
		etapa.fase = 4;
	}
}