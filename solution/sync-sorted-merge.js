"use strict";

const { indexOf } = require("lodash");

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  // Greedy solution
  const nextEntries = logSources.map(source => source.pop());
  let exhaustedSources = 0;
  while(exhaustedSources < logSources.length){
    let minEntry = nextEntries[0];
    for(let i = 1; i < nextEntries.length; i++){
      if(nextEntries[i] === false) continue;
      if(minEntry === false || nextEntries[i].date < minEntry.date){
        minEntry = nextEntries[i];
      }
    }
    // print it
    printer.print(minEntry);

    // this is another m operations - this could be removed if we stored and index of the min entry as we went as I've done on the async version
    const sourceIndex = indexOf(nextEntries, minEntry);
    nextEntries[sourceIndex] = logSources[sourceIndex].pop();
    if(nextEntries[sourceIndex] === false){
      exhaustedSources++;
    }
  }
  
  return console.log("Sync sort complete.");

};
