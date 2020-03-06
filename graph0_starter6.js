// CPCS 324 Algorithms & Data Structures 2
// Graph data structure starter - First Edge Object
// 2019, Dr. Muhammad Al-Hashimi

// -----------------------------------------------------------------------
// simple graph object with linked-list edge implementation and minimal fields
// extra vertex and edge member fields and methods to be added later as needed
//

var _v = [], _e = [];   // globals used by standard graph reader method


// -----------------------------------------------------------------------
// global caller function, a main() for the caller page
// only function allowed to access global vars

function _main()
{
   // create a graph (default undirected)
   var g = new Graph(); 

   // set input graph properties (label, directed etc.)
   g.label = "Figure 3.10 (Levitin, 3rd edition)";

   // use global input arrays _v and _e to initialize its internal data structures
   g.read_graph(_v,_e);

   // use print_graph() method to check graph
   g.print_graph(); 

   // report connectivity status if available
   if (g.connectedComps == 0)  {
       document.write("<p> no connectivity info </p>");
   } else {
       document.write("<p>DISCONNECTED  " , g.connectedComps ,"</p>"); 
   }	

   // perform depth-first search and output stored result
   g.travers = "dfs" ;
   g.topoSearch(); 
   document.write("<p>dfs_push: ",g.dfs_push,"</p>");

   // report connectivity status if available
   if (g.connectedComps == 0)  {
      document.write("<p> no connectivity info </p>");
  } else {
      document.write("<p>DISCONNECTED  " , g.connectedComps ,"</p>");
  }	
  
   // perform breadth-first search and output stored result
   g.travers = "bfs";
   g.topoSearch();
   document.write("<p>bfs_order: ",g.bfs_out,"</p>");

   // output the graph adjacency matrix
   g.makeAdjMatrix() ;
   document.write("<p>first row matrix: ", g.djacencyMatrix[0], "<p>");
   document.write("<p>last row matrix: ", g.djacencyMatrix[g.nv-1], "<p>");

}


// -----------------------------------------------------------------------
// Vertex object constructor

function Vertex(v)
{
   // user input fields

   this.label = v.label;          // vertex can be labelled

   // more fields to initialize internally

   this.visit = false;            // vertex can be marked visited or "seen"
   this.adjacent = new List();    // init an adjacency list

   // --------------------
   // member methods use functions defined below

   this.adjacentById = adjacentById ;  // return target id of incident edges in array

}

// -----------------------------------------------------------------------
// Edge object constructor
function Edge (){
   this.target_v  ;
   this.weight  ; 
 } 
// -----------------------------------------------------------------------
// Graph object constructor

function Graph()
{
   this.vert = [];                // vertex list (an array of Vertex objects)
   this.nv;                       // number of vertices
   this.ne;                       // number of edges
   this.digraph = false;          // true if digraph, false otherwise (default undirected)
   this.dfs_push = [];            // DFS order output
   this.bfs_out = [];             // BFS order output
   this.label = "";               // identification string to label graph

   // --------------------
   // student property fields next

   this.connectedComps = 0          // number of connected comps set by DFS; 0 (default) for no info
   this.makeAdjMatrix = makeAdjMatrix ;
   this.djacencyMatrix = [];       // graph adjacency matrix to be created on demand


   // --------------------
   // member methods use functions defined below

   this.read_graph = better_input;   // default input reader method
   this.print_graph = better_output; // better printer function
   this.list_vert = list_vert;

   this.add_edge2 = add_edge2;        // replace (don't change old .add_edge)
   this.dfs = dfs;                  // DFS a connected component
   this.bfs = bfs;                  // BFS a connected component

   // --------------------
   // student methods next; implementing functions in student code section at end

   this.topoSearch = topoSearch ;      // perform a topological search
   this.travers = " ";  
   this.isWeighted = false ; 
}


// -------------------------------------------------------
// Functions used by methods of Graph object. Similar to
// normal functions but use object member fields and
// methods, depending on which object is passed by the
// method call through the self variable: this.
//

// --------------------
function list_vert()
{
   var i, v;  // local vars
   for (i=0; i < this.nv; i++)
   {
      v = this.vert[i];
      document.write( "VERTEX: ", i, " {", v.label, "} - VISIT: ", v.visit,
         " - ADJACENCY: ", v.adjacentById(), "<br>" );
   }
}

// --------------------
function better_input(v,e)
{
   this.nv = v.length;
   this.ne = e.length;

   var i=0;
   while(i < this.nv ){
   this.vert[i] = new Vertex(v[i]);
    i++;
   }

   var i=0;
   while(i < this.ne ){
   this.add_edge2(e[i].u, e[i].v);
    i++;
   }

   if (!this.digraph)
        this.ne = e.length * 2;
 
   if((!e[0].w === undefined))
       this.isWeighted = true; 
}

// --------------------
function better_output()
{
   document.write("<p>GRAPH {",this.label, "} ", this.digraph?"":"UN", "DIRECTED - ", this.nv, " VERTICES, ",
      this.ne, " EDGES:</p>");

   // list vertices
   this.list_vert();
}

// --------------------
function add_edge2(u_i,v_i,w)    // obsolete, replaced by add_edge2() below
{
	var u = this.vert[u_i]; 
   var v = this.vert[v_i];
   
	var edge ; 	
	edge = new Edge() ;
   edge.target_v=v_i ;
   
	 if(!(w === undefined)) {
	     edge.weight = w ; 
	 }

	 u.adjacent.insert(edge) ; 
		
	if(!this.digraph) {

      edge = new Edge() ;
      
		if(!(w === undefined)) {
	     edge.weight = w ; 
	 }
		 
	    edge.target_v = u_i;
	    v.adjacent.insert(edge) ; 

	}

}

// --------------------
function dfs(v_i)
{
   var v = this.vert[v_i];
   v.visit = true;
   this.dfs_push[this.dfs_push.length] = v_i;

   var x = v.adjacentById();
	var y = x.length;
	
   var i=0;
   while(i < y ){

   if (!this.vert[x[i]].visit) {
          this.dfs(x[i]);
   }
   i++;
   }
}

// --------------------
function bfs(v_i)
{
    var v = this.vert[v_i];
    v.visit = true;
    this.bfs_out[this.bfs_out.length] = v_i;

    var queue = new Queue();
    queue.enqueue(v);
    while (!queue.isEmpty()) {
           var u = queue.dequeue();
           var w = u.adjacentById();
           for (var i = 0; i < w.length; i++) {
           if (!this.vert[w[i]].visit) {
                this.vert[w[i]].visit = true;
                queue.enqueue(this.vert[w[i]]);
                this.bfs_out[this.bfs_out.length] = w[i];
            }
        }
    }
}


// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// --- begin student code section ----------------------------------------

function adjacentById()
{
   var adjacentArr = [];
   var adjacentTrav = this.adjacent.traverse();

   var i=0;
   var y = adjacentTrav.length ;

   while(i < y ){
   adjacentArr[i] = adjacentTrav[i].target_v;
   i++;
   }
   
   return adjacentArr;
}

// --------------------
/**function add_edge2(u_i,v_i)
{
    // fetch vertices using their id, where u: edge source vertex, v: target vertex



   // insert (u,v), i.e., insert v in adjacency list of u
   // (first create edge object using v_i as target, then pass object)



   // insert (v,u) if undirected graph (repeat above but reverse vertex order)



}*/

// --------------------
function topoSearch()
{
   var i=0;
   while(i < this.nv ){
      this.vert[i].visit = false;
   i++;
   }

   var i=0;
   while(i < this.nv ){
   if (!this.vert[i].visit) {

      if (this.travers == "dfs"){
         this.dfs(i);
      } else {
         this.bfs(i) ; 
      }
      this.connectedComps++;
    }
   i++;
   }

}

// --------------------
function makeAdjMatrix()
{
   // initially create row elements and zero the adjacency matrix

   var i=0;
   while(i < this.nv ){
         this.djacencyMatrix[i] = [] ;
         for (var j = 0 ; j< this.nv ; j++ ){
             this.djacencyMatrix[i][j] = 0 ;
     }
   // for each vertex, set 1 for each adjacency
   var w1 = this.vert[i].adjacentById() ; 
   var w2 = this.vert[i].adjacent.traverse();

   var k = 0 ;
   while (k < w1.length){

   if (!this.isWeighted){
        this.djacencyMatrix[i][w1[k]] = 1;
   } else {
        this.djacencyMatrix[i][w1[k]] = w2[k].w1 ;
   }
   k++;   
   } 
i++;
}
}
