PokeVerse
=========

Short Description:
------------------
PokeVerse is a React-powered Pokédex app where you can explore Pokémon, build custom teams, and simulate battles — all using real-time data from the PokéAPI.

About:
------
PokeVerse is a TypeScript-based web app that brings the Pokémon universe to life. Users can browse all Pokémon, create and manage custom teams, and simulate team battles using actual stat-based logic. Powered by PokéAPI, this project is a clean, scalable, and interactive Pokémon experience for fans and developers alike.

Setup Instructions:
-------------------

1) Clone the Repository:
   git clone https://github.com/prakhar7824/poke-verse.git

2) Run the Project:

   - Navigate to the project folder:
     cd poke-verse

   - Install the dependencies:
     npm install

   - Start the development server:
     npm run dev

Languages & Technologies Used:
------------------------------

Languages:
- TypeScript
- JavaScript
- CSS

Frameworks/Libraries:
- React
- React Router
- Tailwind CSS
- Lucide React Icons

API:
- PokeAPI

Project Features:
-----------------

✅ Pokédex Explorer  
→ Browse, search, and filter all Pokémon.

✅ Team Builder  
→ Create, name, and manage custom Pokémon teams.

✅ Team Requirements  
→ Teams must have 3–6 Pokémon to be battle-ready.

✅ Team vs Team Battles  
→ Select two teams and simulate a battle based on total power (with randomness).

✅ Battle-Ready Status  
→ Teams show if they're ready for battle.

✅ Detailed Pokémon Info  
→ View stats, abilities, moves, and more.

Files and Their Functions:
--------------------------

- **Index.tsx**  
  → Main website homepage that displays all Pokémon cards. Hovering shows quick info.

- **Teams.tsx**  
  → Team management page. Users can create teams, name them, select Pokémon, and initiate team battles.

- **PokemonDetail.tsx**  
  → Shows detailed Pokémon data: basic info (height, weight, type, ability) and advanced info (stats, abilities, moves) in separate tabs or sections.

- **BattleArena.tsx**  
  → Dedicated page to simulate battles between selected teams, using calculated power with added randomness.

How to Add New Features:
------------------------

- Add new pages to:  
  `src/pages/`

- Add custom hooks to:  
  `src/hooks/`

- Add reusable UI components to:  
  `src/components/ui/`

- Use or extend context providers in:  
  `src/contexts/`

Keywords:
---------

pokeverse, pokedex, react pokedex, pokémon app, pokémon team builder, pokémon battle simulator, react project, typescript react, tailwind css, pokeapi, pokémon explorer, pokémon stats, lucide icons, react router, web pokémon game, pokémon battle logic, open-source pokémon ui

License:
--------
MIT – use freely, modify as needed, just don’t try to catch ‘em all without giving credit 😉

