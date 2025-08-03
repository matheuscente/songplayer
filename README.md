Uma API REST de estudo para gerenciamento de álbuns, músicas, compositores e artistas.

## Tecnologias

- Node.js
- Express
- TypeScript
- SQLite
- Joi (validações)
- Jest (testes)
- PrismaORM

## Para testes, setar o DATABASE_URL do .env para "file:./test.db"

## Regras de negócio

## artista: 
 - o nome é uma string obrigatória ;
 - a nacionalidade é uma string obrigatória;
 - para deletar um artista não, não pode haver álbuns referenciando o mesmo.


## álbum: 
 - o titulo da álbum é obrigatório e deve ser uma string;
 - o ano é obrigatório e deve ser menor que o ano atual;
 - o artista é obrigatório e deve existir no banco de dados;
- ao buscar álbuns com suas relações, deve se mostrar corretamente o numero de músicas relacionadas e a duração do álbum total.


## música: 
 - o nome é uma string obrigatória;
 - o ano é obrigatório e deve ser menor que o ano atual;
 - o duração é uma string obrigatória e deve estar no formato "HH:MM:SS";


## compositor: 
 - o nome é uma string obrigatória;


## songAlbum
 - o songId é  um número obrigatório;
 - o albumId é  um número obrigatório;
 - ambos devem existir no banco de dados;

## songComposer
 - o songId é  um número obrigatório;
 - o composerId é  um número obrigatório;
 - ambos devem existir no banco de dados;
 - A composição é obrigatória e deve ser uma string.

## nas relações 
- a criação de uma relação deve ser feita manualmente na rota indicada
- ao deletar uma entidade referenciada, a relação é deletada automaticamente.
- para atualizar uma relação, deve usar a rota de deleção para deletar a mesma e usar a rota de criação para criar uma nova relação.
- para buscar as entidades com suas relações, usar o parâmetro query ""relations=true"
- o parâmetro query ""relations" só deve ser especificado com "true".
- ao buscar compositor com suas relações, deve exibir o tipo de composição para cada música
- ao buscar música com suas relações, deve exibir o tipo de composição para cada compositor.

## As rotas com seus respectivos esquemas estão na coleção postman, na pasta "postman" da página inicial deste repositório!
