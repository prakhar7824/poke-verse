1)Clone the repository using the command - 
"git clone https://github.com/prakhar7824/poke-verse.git"

2)After cloning run the project using -
-navigate to project-
"cd poke-verse"
-install dependencies-
"npm install"
-run the project-
"npm run dev"

3)Languages & Technologies Used - 
- Languages: TypeScript, JavaScript, CSS
- Frameworks/Libraries: React, React Router, Tailwind CSS, Lucide React Icons
- API: [PokeAPI](https://pokeapi.co/)
  
4)Project Features - 
- Pokédex Explorer: Browse, search, and filter all Pokémon.
- Team Builder: Create, name, and manage custom Pokémon teams.
- Team Requirements: Teams must have 3-6 Pokémon to be battle-ready.
- Team vs Team Battles: Select two teams and simulate a battle based on total power (with randomness).
- Battle-Ready Status: Teams show if they're ready for battle.
- Detailed Pokémon Info: View stats, abilities, moves, and more.
  
5)Files and thier works -
  Index.tsx - main website Homepage displays all pokemons cards along with little detailed when hovered with cursor pointer.
  Teams.tsx - teams section where user can create teams, custom names, self select pokemons and team battles.
  PokemonDetail.tsx - shows basic details like height, weight, type, ability and advanced details like stats, abilities, moves, info are in seperate sections.
  BattleArena.tsx - battle simulation page for selected pokemons.
  
6)How to add new features -
  - Add new pages to 'src/pages/' and routes in 'App.tsx'.
  - Add new hooks to 'src/hooks/' for custom logic
  - Add new UI components to 'src/components/ui/' for design consistency.
  - Use or extend context providers in 'src/contexts/' for global stats
