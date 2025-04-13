# Roteiro

## Modelagem

- Cada participante está relacionado a um usuário
- Um participante pode participar de 1 ou mais edições
- Cada edição pode contar com 1 ou mais notas e 1 ou mais metas
- O ano da edição está delimitado entre a primeira edição feita (1998) e o ano
  atual (2025)
- O valor de uma nota ou de uma meta está delimitado entre 0 e 1000
- Por se tratarem de 4 opções de conteúdo, esses foram colocados em um Enum
- Os scores e goals foram separados em entidades diferentes e independentes,
  pois como o modelo permite que o usuário participe de mais de uma edição,
  pensei que seria proveitoso se o banco relacional pudesse reaproveitar as
  tabelas de notas e de metas, pois isso evitaria redundância e iria
  minimizar armazenamento.

### Mostrando a aplicação

0. Limpar deploys anteriores (banco, arquivos gerados anteriormente, ...)
1. Criar 1 participante chamado Lucas (user: user)
2. Criar 1 resultando para o ano de 2025, mostrando o constraint do ano
3. Criar 1 meta para a edição de 2025, mostrando o constraint da pontuação
   > Pontuar que o enum faz com que uma lista de materias seja exibido
4. Entrar na conta do 'user' e mostrar que usuários não administradores não
   podem criar outros participantes

### Pontos adicionais

1. tradução PT-BR
2.

### Da minha experiencia com a atividade

- Documentação do Jhipster
- Pesquisa no google de pontos ligados ao JPA
  > já fiz uma materia na UFES de desenvolvimento web que trazia um padrão de
  > projeto feito em java que também usava JPA, DTO, Jakarta e outras
  > ferramentas
- Pontos que não ficaram claros/exigiam mais explicação: ChatGPT

### Problemas/soluções

1. Dados mockados a cada reboot da aplicação

A ferramenta preenchia o banco de dados a cada vez que era inicializada com
dados gerados pela biblioteca faker. Foi necessário desabilitar uma
configuração da aplicação para deixar de fazer isso.

2. Limitações do JDL

A ferramenta grafica JDL é uma mão na roda, pois automatiza e agiliza a escrita
do código necessário para integrar os serviços do app, porém é limitada

> Relacionamento unidrectional de 1 para muitos ainda [não foi implementado no JDL](https://www.jhipster.tech/managing-relationships/#a-unidirectional-one-to-many-relationship).

> Foi necessário usar relacionamento bidirecional de 1 para muitos

3. Entidades antigas e sem uso atrapalhavam reboot da aplicação

Ao longo do projeto eu utilizei diferentes arquivos de modelagem UML e percebi
que o App estava usando entidades que não existiam mais nos modelos mais recentes
que eu estava escrevendo (mesmo derrubando a aplicação, o container docker
onde o postgres estava rodando e usando a regra de clean do `./mvnw`).

4. O código de backend/frontend é gerado do zero, apagando modificações
   prévias feitas

Além disso, sempre que eu utilizava uma modelagem UML diferente, algumas
partes do código do backend que eu havia modificado eram apagadas e voltavam
ao default.

Para resolver os pontos 1, 3 e 4, resolvi fazer um script bash simples para
remover a pasta src (que contem todo o codigo do front e back), regerar os
arquivos do back/front e reaplicar as mudanças feitas por mim usando o git e
um arquivo de patch com as mudanças.
