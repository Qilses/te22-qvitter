**länk till repo med CRUD (Create, read, update & Delete)**
----------------------------------------------------------------------
https://github.com/Qilses/te22-qvitter 


**Förklara dina routes, gör gärna en tabell (se länk) som visar dem (REST)**
--------------------------------------------------------------------------
| Gick bra                                                                           	| Gick dåligt / sämre                                                                               	| Vill lära mer om                                                   	| Routes och vad de gör                                                                                                                                                                                                                	|   	|
|------------------------------------------------------------------------------------	|--------------------------------------------------------------------------------------------------	|--------------------------------------------------------------------	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|---	|
| Css blev  snygg och  fick lite  "flare" ändå                                       	| Stava rätt, har dyslexi                                                                          	| Vill lära mig mer om vad Java kan  göra och hur det funkar med SQL 	| Index: start sida, blev inte klar missade delar som loggin eller välj andvändare. Layout: Grunden till alla sidor Tweet: Vissar alla Qvitter post. Component: La nyss till så har inte gjort mycket för att se till att allt funkar. 	|   	|
| Det blev ändå något som man kan kolla och interaktera med                                                               	| Missade delar som: Edit, component mappen & vad som är i den  och att lägga till dom som routes. 	|                                                                    	| New: Skapar nya tweets här, missar "flare" ect Edit: blev inte klar med dena eftersom att det är en del av component. Men tänker att den ska edita saker som redans fins på servern. (Om man är ägaren av posten)                    	|   	|
| Fattar bättre hur en  SQL (Secure query language)  funkar och andvändings områden. 	| Många saker gick  lite snätt men de  gick väggen ändå.                                           	|                                                                    	| Tweet-form: är en del av component som jag missade föregående lektionen som jag la till eftersom att jag såg att den fattades.                                                                                                       	|   	|




**Hur har du arbetat med säkerheten? Tvätta / validera.**
----------------------------------------------------------------------
Views alla routes är i en skyddad map vilket gör att du inte kan komma åt mappen utifrån detta gör att du inte ka edita länken för att ta andävndare till andra ställe. 

Samma sak med views mappen. den finns inte i public mappen så ingen kan komma åt dom utrifrån och ändra något på servern. Du kan självfallet ändra saker på din egen client men det går inte att komma åt servern från den clienten. 

Sen så har vi en .gitignore fil som säger till vsco de att ignorera att laddu upp dessa till github. Det som finns där är .env & node_module, env är inloggning till servern och sägger till dom vart servern finns. node_module ignorera man för att det är en gigantisk mapp som tar uttryme och det uppdateras ofta så tar mycke plats.

La inte till något skäl för att jag inte hadde tid med det. Tänkte göra så att man kunde ändra Andvändare och lägga till en login men det hadde jag inte tid med. 




**Har du gjort något extra funktion och hur fungerar den?**
-
Har bara lagt till css "flare", så att listor blir mer stilrena och att kanpparna blir större när man hovrar över dom, Finns fortfarande saker som jag skulle vilja fixa men just nu om detta är sista lektionen vi har på detta så har jag inte tid med det.

    

    
