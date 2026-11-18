# Trabalho Avaliativo de Estrutura de Dados
## Luiza Araújo e Souza RA: 2840482521032
### Árvore de Busca Binária

**_Link:_**
https://youtu.be/kbhV1obs_MM

Link com emoção: https://youtu.be/HyAI6K5kF_k

## Resumo Teórico
A árvore binária de busca é uma estrutura de dados que permite a utilização da busca binária para pesquisa, inserção e remoção de itens. Ela pode ser utilizada para representar hierarquia em dados ou como uma maneira de guardar dados de uma forma de fácil pesquisa.

### Tabela de Complexidade

| Operação  | Melhor Caso | Caso Médio | Pior Caso |
| ------------- | ------------- |  ------------- | ------------- | 
| insert / search / delete | O(1)  | O(log n) | O(n) |
| Travessias  | O(n)  | O(n) | O(n) |

### Melhor Caso 
O insert/search/delete podem variar pois essas funções descem em um único caminho desde a raiz até algum nó, escolhendo um lado a cada comparação. O custo é é o comprimento, no máximo h.
 ### Caso Médio
As inserções acontecem em ordem aleatória. Nesse cenário a árvore tende a ficar razoavelmente equilibrada. A cada busca é descartado, em média, uma fração grande da árvore, parecido com a busca binária.

### Pior Caso
O pior caso acontece quando a árvore degenera em lista encadeada, por exemplo quando é inserido valores ordenados. Cada comparação descarta só um nó em vez de metade. Ao buscar o último elemento, é necessário percorrer a árvore inteira.

## Relatório de IA

A ferramenta utilizada para esse projeto foi a Claude.ai, a IA foi utilizada principalmente para gerar a demo visual e gerar os casos de teste no código.

### Prompts Principais

> crie uma demonstranção visual seguindo essas instruções:
 Na Demo Visual: desenhar os nós e conexões da árvore, animar o caminho percorrido na busca/inserção e animar a ordem de visitação das 3 travessias.
• Incluir botão comparando Inserção Aleatória ($O(\log n)$) vs. Inserção Ordenada / Árvore Degenerada ($O(n)$).
Execução Passo a Passo: Botões de Executar / Play, Próximo Passo (Step), Pausar e Reiniciar (Reset).
Cenários Pré-configurados: Botões para carregar rapidamente exemplos didáticos (ex.: Caso Médio, Pior Caso, Exemplo Customizado).
Painel de Estado e Métricas: Exibição em tempo real do que está acontecendo no passo atual (log explicativo do passo, número de comparações/operações acumuladas e estado das variáveis auxiliares).
Autocontido: Deve funcionar abrindo o arquivo index.html diretamente no navegador (sem exigir instalação complexa de servidores backend).

> faça um if __name__ == "__main__": que execute 3 cenários de teste comentados (caso comum, caso de borda e pior caso), imprimindo o resultado e o total de operações realizadas

> dividir o projeto em index.html, styles.css e app.js.

### Ajuste Manual

Durante a criação da demo, tive que pedir ajuste para melhorar a aparência da primeira demo gerada. Solicitei por mundança no padrão completo, deixando em "modo noturo" e deixando os botões em destaque em roxo. 
Tive, também, que pedir para dividir o código em .hmtl, .css e .js para se encaixar no padrão do trabalho.


