#node-file-search-indexer

This Script uses two Parts, the Indexer and the Web-Service.
The Indexer is called through a cron / Taskplanner Job (example: reIndexer.cmd).

The Web-Service should run as Service.
I used nssm for Windows.
I am pretty sure you can daemonize it with forever under Linux.

There is no further documentation, but i think it's not needed. Source is very small.

I only use it under Windows, but i am pretty sure it works everywhere, 
because i used native librarys.

I know it is a stupid and insecure implementation, BUT .. 
Feel free to use (parts of) it  ... ON YOUR OWN RISK!

## To install:

Prerequisites :

- nodejs or iojs
- npm
- cron or taskplaner like tool.
- no binary dependencies, except for Windows-Service (i use https://nssm.cc/)

node_modules:

- express
- isnumeric
- nedb
- filewalker

# Resources:

- [nodejs](http://nodejs.org/)
- [iojs](https://iojs.org/)
- [nedb](https://github.com/louischatriot/nedb)
- [filewalker](https://github.com/oleics/node-filewalker)
- [isnumeric](https://github.com/leecrossley/isNumeric)
- [express](http://expressjs.com/)
