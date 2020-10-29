# limited-map
This is a limited map. Limited by the administrator privilege. Limited by the scope.

Why: The director asked if an interactive map can be made to plot all our suppliers visually.
Limitation: At work, the default system is Windows 10 PC. 
Attempts
1) Naturally, given the development environment, the first candate to accomplish the deed is Excel charts. Unfortunately, the Map chart gave me errors because of the table structure (can't take coordinates, address, postal codes, together with names as labels).
2) Alternatively, Excel offers 3D Map. In spite of the success at generating the map, the "interactive" aspect of the request was far from fulfilled.
3) I have done data visualization in AJAX. However, Google Map API has moved to Google Cloud Platform and the use of its API would require a personal API key.
4) I have an experience with loading the Excel data to Google Map under Google Drive. The concern is the confidentiality of the database and its tie to the Google Drive account.
5) While Batch would require the additional libraries or components to generate a map. No new installs can be done without the IT request on my work PC. My only other development 
option is in Javascript, since it is generally a client-side scripts.
6) With Javascript in mind, NodeJS is out of order for the same under-privilege obstacle. However, jQuery is able to handle a basic file parsing and most can be accomplished using Vanilla JS.
7) D3js.org is the most recognized name in the area of data visualization in Javascript. Of course, it has the Map visualization module.
8) The use of D3js is not poorly documented. The examples are not scarce. However, the examples are laid out in an ascending execution order and many of them are outdated. Since the overhaul of the library between v4 and v5 (and now it is v6), some examples would only work in v4 and there is no counterexample using v6 or even v5. The asynchronous or at-event executions seem to be still available in v6 as in v4, simply replacing the library does not work (i.e, the upgrade did not have backward compatibility?). The documentation relies heavily on the examples and references are counterintuitive (or unaccustomed personally), thus was not useful to me. Furthermore, and the most critically, few examples demonstrated its interactiveness and through the examples, I did not envision the path to creating map zoomed only to the Midwest region by default.
9) After 2 days of fiddling with the D3js, I decided to move on to Leaflet, another Javascript library to create interactive map but would borrow the base map from the third-party resource (e.g., OpenStreetMap).
