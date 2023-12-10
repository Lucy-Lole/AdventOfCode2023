var fs = require('fs');

function takeRangesThroughMap(ranges, mapData) {
    let returnArray = [];

    ranges.forEach(seedRange => {
        returnArray = [...returnArray, ...takeSingleRangeThroughMap(seedRange, mapData)];
    })

    return returnArray;
}

function takeSingleRangeThroughMap(range, mapData) {
    for (i = 0; i < mapData.length; i++) {
        let mapRange = mapData[i];
        if ((mapRange.sourceStart > range.start) && (mapRange.sourceStart < range.start+range.length)) {
            if (mapRange.sourceStart+mapRange.length < range.start+range.length) {
                // we are just a range in the middle of our seed range, we need 3 parts
                let preRange = {start:range.start, length:mapRange.sourceStart-range.start};
                let midRange = {start:mapRange.destStart, length:mapRange.length};
                let postRange ={start:range.start+preRange.length+midRange.length, length:(range.start+range.length)-(range.start+preRange.length+midRange.length)}

                return [...takeSingleRangeThroughMap(preRange, mapData), midRange, ...takeSingleRangeThroughMap(postRange, mapData)]
            }
            else {
                // we just need the pre range part and the mid range part
                let preRange = {start:range.start, length:mapRange.sourceStart-range.start};
                let midRange = {start:mapRange.destStart, length:range.length-preRange.length};

                return [...takeSingleRangeThroughMap(preRange, mapData), midRange];
            }
        }
        else if ((mapRange.sourceStart <= range.start) && (mapRange.sourceStart + mapRange.length > range.start)) {
            if (mapRange.sourceStart == range.start && mapRange.length == range.length) {
                // map range = seed range
                let midRange = {start:mapRange.destStart, length:range.length};
                return [midRange];
            }
            else if (mapRange.sourceStart + mapRange.length >= range.start+range.length) {
                // Map range encompasses our entire seed range
                let midRange = {start:mapRange.destStart + (range.start-mapRange.sourceStart), length:range.length};
                return [midRange];
            }
            else {
                // Map range just overlaps a bit, so we need two parts
                let midRange = {start:mapRange.destStart + (range.start-mapRange.sourceStart), length:(mapRange.sourceStart+mapRange.length)-range.start};
                let postRange = {start:range.start+midRange.length, length:range.length-midRange.length}
                return [midRange, ...takeSingleRangeThroughMap(postRange, mapData)];
            }
        }
    }

    return [range];
}

var lines = fs.readFileSync("./Inputs/input5.txt").toString().split('\n');
lines.pop(); // Remove the empty line

var seeds = [];
var soilMap = [];
var fertMap = [];
var waterMap = [];
var lightMap = [];
var tempMap = [];
var humidMap = [];
var locMap = [];
var currentMap;

// Parsing the string data into our data structures.
lines.forEach(line => {
    if (line.startsWith("seeds: ")) {
        let tmpSeeds = [...line.slice(7).split(' ')];
        for (i = 0; i < tmpSeeds.length; i+=2) {
            seeds.push({start:parseInt(tmpSeeds[i]), length:parseInt(tmpSeeds[i+1])});
        }
    }
    else if (line == '') {
        return;
    }
    else if (line.endsWith(':')) {
        if (line == "seed-to-soil map:") currentMap = soilMap;
        else if (line == "soil-to-fertilizer map:") currentMap = fertMap;
        else if (line == "fertilizer-to-water map:") currentMap = waterMap;
        else if (line == "water-to-light map:") currentMap = lightMap;
        else if (line == "light-to-temperature map:") currentMap = tempMap;
        else if (line == "temperature-to-humidity map:") currentMap = humidMap;
        else if (line == "light-to-temperature map:") currentMap = tempMap;
        else currentMap = locMap;
    }
    else
    {
        let nums = line.split(' ');
        currentMap.push({destStart:parseInt(nums[0]), sourceStart:parseInt(nums[1]), length:parseInt(nums[2])});
    }
})

// Start processing the ranges
seeds = takeRangesThroughMap(seeds, soilMap);
seeds = takeRangesThroughMap(seeds, fertMap);
seeds = takeRangesThroughMap(seeds, waterMap);
seeds = takeRangesThroughMap(seeds, lightMap);
seeds = takeRangesThroughMap(seeds, tempMap);
seeds = takeRangesThroughMap(seeds, humidMap);
seeds = takeRangesThroughMap(seeds, locMap);

// Return the lowest possible value;
console.log(Math.min(...seeds.map(x => x.start)));