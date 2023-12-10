var fs = require('fs');

function getNextValueFromMap(initialValue, mapData) {
    let finalValue = initialValue;

    for (i = 0; i < mapData.length; i++) {
        let mapRange = mapData[i];
        if ((mapRange.sourceStart <= initialValue) && (initialValue <= (mapRange.sourceStart+mapRange.length))) {
            finalValue = mapRange.destStart + (initialValue - mapRange.sourceStart);
            break;
        }
    }

    return finalValue;
}

var lines = fs.readFileSync("./Inputs/input5.txt").toString().split('\n');
lines.pop(); // Remove the empty line

var smallestDistance = 999999999999999999;

var seeds = [];
var soilMap = [];
var fertMap = [];
var waterMap = [];
var lightMap = [];
var tempMap = [];
var humidMap = [];
var locMap = [];
var currentMap;

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

seeds.forEach(seed => {
    for (currSeed = seed.start; currSeed < seed.start + seed.length; currSeed++){
        let currentPos = currSeed;
        // Map the seed to soil
        currentPos = getNextValueFromMap(currentPos, soilMap);
    
        // map the soil to fertilizer
        currentPos = getNextValueFromMap(currentPos, fertMap);
    
        // map the fertil to water 
        currentPos = getNextValueFromMap(currentPos, waterMap);
    
        // map the water to light
        currentPos = getNextValueFromMap(currentPos, lightMap);
    
        // map the light to temp
        currentPos = getNextValueFromMap(currentPos, tempMap);
    
        // map the temp to humidity
        currentPos = getNextValueFromMap(currentPos, humidMap);
    
        // map the humidity to location
        currentPos = getNextValueFromMap(currentPos, locMap);
    
        if (currentPos < smallestDistance) smallestDistance = currentPos;
    }
})

console.log(smallestDistance);