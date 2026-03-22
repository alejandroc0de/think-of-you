# Install react Router dom 
# Tree is src and then pages for the auth pages and app for the home page
# Once client is connected we read the token saved when client logged on. Then i create the socket 
# I use navigate cause i cannot render a route and a router in the return of a function, so import Usenavigate and instance it, then use it passing the router where i want to navigate to

# Cors is blocking fetch request from the frontend, so i added cors to the server, and specify the route that will be allowed, it can be found un ENV so i can update it later once deployed