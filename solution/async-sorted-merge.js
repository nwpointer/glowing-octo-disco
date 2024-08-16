"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

// key:
// n = the number of log entries across all sources
// m = the number of log sources

// Time and space complexity analysis:
// solution takes 2m * n operations which equals o(mn)
// it takes an addition m entries to store the frontier
// this solution works well if m is small
// if m is large, specifically if m is greater than log(n) then this solution is not optimal
// in that case, a merge sort would be faster which would take o(n log n) operations but may require more memory that is available

// note: that we're logging while sorting and logging is relatively slow so that might be a bottleneck, might be better to batch sorted logs & then print them
// note: if popping is slow this solution will be slow as well and it might make sense to prefetch a few entries from each source to have then ready to go

module.exports = async (logSources, printer) => {
  const nextEntries = await Promise.all(logSources.map(source => source.pop()));
  let exhaustedSources = 0;
  while(exhaustedSources < logSources.length){
    // find the next smallest entry
    // this is m operations
    let minEntry = nextEntries[0];
    let minEntryIndex = 0;
    for(let i = 1; i < nextEntries.length; i++){
      if(nextEntries[i] === false) continue;
      if(minEntry === false || nextEntries[i].date < minEntry.date){
        minEntry = nextEntries[i];
        minEntryIndex = i;
      }
    }
    // print it
    printer.print(minEntry);

    // this is another m operations - this could be removed if we stored and index of the min entry as we went
    const sourceIndex = minEntryIndex;
    nextEntries[sourceIndex] = await logSources[sourceIndex].pop();
    if(nextEntries[sourceIndex] === false){
      exhaustedSources++;
    }
  }
  console.log("Async sort complete.");
};
