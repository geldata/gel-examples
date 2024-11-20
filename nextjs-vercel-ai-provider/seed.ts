import { createClient } from "edgedb";

import "./envConfig.js";

const client = createClient();

async function main() {
  await client.query(`
# Database Config

## Reset config
configure current branch reset ext::ai::ProviderConfig;

## AI config
configure current branch insert ext::ai::OpenAIProviderConfig {
  secret := "${process.env.OPENAI_SECRET}",
};

## CORS config
configure current branch set cfg::cors_allow_origins := {"*"};
`);

  await client.query(`
delete Book;
delete Author;`);

  await client.query(
    `
with
    books := <array<tuple<author_name: str, title: str, summary: str>>>$books,
    authors := (
      for name in (distinct array_unpack(books).author_name)
      insert Author {
        name := name,
      }
    ),
for book in array_unpack(books)
insert Book {
  title := book.title,
  summary := book.summary,
  author := assert_exists((
    select authors
    filter .name = book.author_name
  )),
};
  `,
    {
      books: [
        {
          author_name: "Elara Thornwood",
          title: "Whispers of the Forgotten",
          summary:
            "Written by Elara Thornwood: An enchanting tale of a hidden village that exists between the folds of time, where the forgotten are remembered.",
        },
        {
          author_name: "Milo Vesper",
          title: "Echoes of the Void",
          summary:
            "Written by Milo Vesper: A cosmic adventure across starlit galaxies to uncover the mysteries of a universe humming with the echo of ancient civilizations.",
        },
        {
          author_name: "Sylvia Quill",
          title: "The Last Alchemist",
          summary:
            "Written by Sylvia Quill: In a world drained of magic, the last alchemist undertakes a quest to reignite the lost sparks of enchantment.",
        },
        {
          author_name: "Finn Barlow",
          title: "Beneath the Drifts",
          summary:
            "A chilling expedition beneath the ice where darkness unveils not just secrets, but a dormant, sinister will.",
        },
        {
          author_name: "Lysandra Vale",
          title: "The Gilded Mirror",
          summary:
            "Written by Lysandra Vale: A cursed mirror reflects alternative realities, trapping its viewers in a labyrinth of their potential lives.",
        },
        {
          author_name: "Caspian Rook",
          title: "The Clockmaker’s Paradox",
          summary:
            "Written by Caspian Rook: A clockmaker in a steampunk city discovers a time paradox that could unravel the very fabric of existence.",
        },
        {
          author_name: "Ariadne Thread",
          title: "The Maze of Many",
          summary:
            "Written by Ariadne Thread: A labyrinth with doors leading to infinite worlds becomes a battleground for those seeking ultimate power.",
        },
        {
          author_name: "Orion Ember",
          title: "Ashes of the Starry Sea",
          summary:
            "Written by Orion Ember: After the stars in the sky mysteriously vanish, a band of astronomers embark on a perilous journey to retrieve them.",
        },
        {
          author_name: "Seraphine Bright",
          title: "Whispering Flames",
          summary:
            "Written by Seraphine Bright: In a realm where fire speaks and the ashes tell tales, a young fire whisperer must save her people from an eternal blaze.",
        },
        {
          author_name: "Thorne Blackwood",
          title: "Nightshade’s Promise",
          summary:
            "Written by Thorne Blackwood: A forbidden forest filled with nightshade flowers promises eternal youth, but at a price that could be too perilous.",
        },
        {
          author_name: "Elena Marquez",
          title: "Whispers of the Forgotten City",
          summary: `Written by Elena Marquez: In the sprawling, labyrinthine city of Velloria, ancient secrets lie buried beneath cobblestone streets and candle-lit alleyways. Ivy Donovan, a young historian, stumbles upon a cryptic map that hints at the location of the legendary Sunken Library, believed to house texts lost since the city's mysterious decline centuries ago. As Ivy delves deeper into the city’s dark past, she must dodge shadowy figures who seek to keep the library's secrets hidden. Alongside an unlikely band of allies, Ivy's quest leads her through hidden passages, haunted catacombs, and forgotten ruins, where she discovers truths that could shake the foundations of her world. As they inch closer to uncovering the city's ancient mysteries, they realize some secrets might have been better left untouched.`,
        },
      ],
    }
  );

  console.log(await client.query("select Book {**};"));

  // Update some authors with their countries of origin
  await client.query(`
      update Author
      filter .name = "Ariadne Thread"
      set { country := "Uruguay" };
    `);

  await client.query(`
      update Author
      filter .name = "Caspian Rook"
      set { country := "South Africa" };
    `);

  await client.query(`
      update Author
      filter .name = "Elara Thornwood"
      set { country := "Ireland" };
    `);

  await client.query(`
      update Author
      filter .name = "Elena Marquez"
      set { country := "Peru" };
    `);

  await client.query(`
      update Author
      filter .name = "Finn Barlow"
      set { country := "Norway" };
    `);

  await client.query(`
      update Author
      filter .name = "Milo Vesper"
      set { country := "Italy" };
    `);

  await client.query(`
      update Author
      filter .name = "Orion Ember"
      set { country := "United Kingdom" };
    `);

  // update the default prompt content
  await client.query(`
    update ext::ai::ChatPrompt 
    filter .name = 'builtin::rag-default'
    set { messages := (
      insert ext::ai::ChatPromptMessage {
        participant_role := ext::ai::ChatParticipantRole.System,
        content:= "You are an expert Q&A system.
          Always answer questions based on the provided context information. 
          If user asks about someone's country always require a tool call.
          Context information is below:
          {context}",
      }
    )};
  `);
}

main();
