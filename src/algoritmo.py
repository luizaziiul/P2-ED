class Node:
    def __init__(self, info):
        self.left = None      
        self.right = None
        self.info = info
 
 
contador = {"chamadas": 0, "visitas": 0}
 
def resetar_contador():
    contador["chamadas"] = 0
    contador["visitas"] = 0
 
 
def total_operacoes():
    return contador["chamadas"] + contador["visitas"]
 
 
def insert(root, info):
    contador["chamadas"] += 1
    if root is None:
        return Node(info)
    if root.info == info:         
        return root
    if root.info < info:
        root.right = insert(root.right, info)
    else:
        root.left = insert(root.left, info)
    return root
 
 
def search(root, info):
    contador["chamadas"] += 1
    if root is None or root.info == info:
        return root
 
    if root.info < info:
        return search(root.right, info)
 
    return search(root.left, info)
 
 
def get_successor(curr):
    curr = curr.right
    contador["chamadas"] += 1
    while curr is not None and curr.left is not None:
        curr = curr.left
        contador["chamadas"] += 1
    return curr
 
 
def del_node(root, x):
    contador["chamadas"] += 1
    if root is None:
        return root
 
    if root.info > x:
        root.left = del_node(root.left, x)
    elif root.info < x:
        root.right = del_node(root.right, x)
    else:
        if root.left is None:
            return root.right
 
        if root.right is None:
            return root.left
 
        succ = get_successor(root)
        root.info = succ.info      
        root.right = del_node(root.right, succ.info)
 
    return root
 
 
def inorder(root):
    if root is not None:
        inorder(root.left)
        print(root.info, end=" ")
        inorder(root.right)
 
 
def printInorder(root):
    contador["chamadas"] += 1
    if root:
        printInorder(root.left)
        print(root.info, end=" ")  
        contador["visitas"] += 1
        printInorder(root.right)
 
 
def printPreorder(root):
    contador["chamadas"] += 1
    if root:
        print(root.info, end=" ")
        contador["visitas"] += 1
        printPreorder(root.left)
        printPreorder(root.right)
 
 
def printPostorder(root):
    contador["chamadas"] += 1
    if root:
        printPostorder(root.left)
        printPostorder(root.right)
        print(root.info, end=" ")
        contador["visitas"] += 1
 
 
#funcao auxilar dos testes
def construir(valores):

    resetar_contador()
    root = None
    for v in valores:
        root = insert(root, v)
    print(f"  Inserção de {len(valores)} valores -> operações: {total_operacoes()}")
    return root
 
 
def buscar(root, valor):
    resetar_contador()
    achou = search(root, valor)
    status = "encontrado" if achou else "NÃO encontrado"
    print(f"  Busca por {valor}: {status} -> operações: {total_operacoes()}")
 
 
def remover(root, valor):
    resetar_contador()
    root = del_node(root, valor)
    print(f"  Remoção de {valor} -> operações: {total_operacoes()}")
    return root
 
 
def travessias(root):
    for nome, funcao in (
        ("Inorder  ", printInorder),
        ("Preorder ", printPreorder),
        ("Postorder", printPostorder),
    ):
        resetar_contador()
        print(f"  {nome}: ", end="")
        funcao(root)
        print(f"-> operações: {total_operacoes()}")
 
 
if __name__ == "__main__":
    print("=== Cenário 1: caso comum (árvore balanceada) ===")
    raiz = construir([50, 30, 70, 20, 40, 60, 80])
    travessias(raiz)
    buscar(raiz, 60)    
    buscar(raiz, 99)    
    raiz = remover(raiz, 20)  
    raiz = remover(raiz, 30)  
    raiz = remover(raiz, 50)   
    print("  Após remoções:")
    travessias(raiz)
 

    print("\n=== Cenário 2: casos de borda ===")
    print("(a) Árvore vazia")
    vazia = None
    buscar(vazia, 10)
    vazia = remover(vazia, 10)
    travessias(vazia)
 
    print("(b) Árvore com um único nó")
    unica = construir([42])
    resetar_contador()
    unica = insert(unica, 42)  
    print(f"  Inserção duplicada de 42 -> operações: {total_operacoes()}")
    travessias(unica)
    unica = remover(unica, 42)
    print(f"  Árvore ficou vazia? {unica is None}")
 
   
    print("\n=== Cenário 3: pior caso (árvore degenerada, 10 nós) ===")
    degenerada = construir(list(range(1, 11)))
    travessias(degenerada)
    buscar(degenerada, 10)   
    degenerada = remover(degenerada, 1)  
    degenerada = remover(degenerada, 10)  
    print("  Após remoções:")
    travessias(degenerada)