## IA Financeiro

O **IA Financeiro** é uma aplicação desenvolvida com **React**, **TypeScript** e **Inteligência Artificial**, criada para ajudar o usuário a organizar melhor sua vida financeira.

A aplicação permite que o usuário informe sua renda, seus gastos, dívidas e uma meta financeira. Com base nesses dados, o sistema gera uma simulação e apresenta insights personalizados, ajudando a entender se a meta é viável e quais ajustes podem ser feitos para alcançá-la.

## Funcionalidades

- Criação de simulações financeiras;
- Geração de análise personalizada com IA;
- Exibição de resumo da simulação;
- Histórico de simulações salvas;
- Possibilidade de excluir simulações;
- Página de detalhes com os insights gerados;
- Chat com o Educador Financeiro;
- Histórico de perguntas e respostas salvo no navegador.

## Tecnologias utilizadas

O projeto foi desenvolvido utilizando:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Google Gemini API
- LocalStorage

## Como executar o projeto

Para rodar o projeto na sua máquina, siga os passos abaixo:

- git clone https://github.com/GabrielBragaRavanelli/IA-FINANCEIRO.git
- cd IA-FINANCEIRO
- npm install

Depois, crie um arquivo .env na raiz do projeto e adicione sua chave da API ( Pegue a chave API neste link --> https://aistudio.google.com/api-keys?project=gen-lang-client-0222594075 - Para criar uma chave, no canto inferiror esquerdo, a um símbolo de uma chave, no qual, ao clicar, será gerado o código da sua chave API. ):

- VITE_GEMINI_API_KEY=sua_chave_aqui

Por fim, execute:

- npm run dev

A aplicação será aberta no navegador pelo endereço indicado no terminal.

## Melhorias implementadas

Durante o desenvolvimento, foram adicionadas novas funcionalidades ao projeto, como a página de histórico de simulações e a conversa com o Educador Financeiro.

Na página de histórico, o usuário consegue visualizar todas as simulações salvas, acessar os detalhes de cada uma e excluir registros quando desejar.

Já no Educador Financeiro, o usuário pode fazer perguntas sobre a simulação realizada. A IA responde de forma clara e personalizada, e todo o histórico da conversa fica salvo para consulta posterior.


## O que aprendi

Com esse projeto, aprendi a trabalhar melhor com rotas no React, persistência de dados com LocalStorage, integração com inteligência artificial e criação de interfaces mais completas e responsivas.
Também pratiquei a organização de componentes, o tratamento de carregamento e erro, além da criação de uma experiência mais útil para o usuário.
