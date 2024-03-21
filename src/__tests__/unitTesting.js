/**
* @jest-environment jsdom
*/

// test('...', function() {
//     expect('...').toBe('...')
// })

//Notes:
//  my tests run calling functions, integration runs clicking buttons.
//  need webpage "built" to interact with elements, but function calls made, not clicked
//  should still look for results in user-like way, b/c better for changing page
//      write any assumptions/dependencies above each test/suite
//  check that require called correctly...???

const { saveChart, loadAllSavedCharts, loadSavedChart, updateCurrentChartData,
    loadCurrentChartData } = require('../lib/chartStorage.js')
//const chartStorage = require('../src/lib/chartStorage.js')
//need chartBuilder?
const generateChartImg = require('../lib/generateChartImg.js')
const sortPoints = require('../lib/sortPoints.js')  //correct formatting for single function
//add jsdom and stuff???
// const fs = require("fs")  //needed for initDomFromFiles()
// const domTesting = require('@testing-library/dom')
// require('@testing-library/jest-dom') //don't need to store it b/c only augmenting
// // const userEvent = require("@testing-library/user-event").default
// function initDomFromFiles(htmlPath, jsPath) {    //may have multiple .js documents? //do they need to be isolated?
//     const html = fs.readFileSync(htmlPath, 'utf8')
//     //load html, but not always script file(s)
//     document.open()
//     document.write(html)
//     document.close()
//     //when seperate script file(s), use this to load test script without caching vars
//     jest.isolateModules(function() {
//         require(jsPath)
//     })
// }

//dirname ensures grabbing test's directory("./")
//initDomFromFiles(`${__dirname}/../registerUser.html`, `${__dirname}/../registerUser.js`)

// describe('chartStorage.js Unit Tests', () => {
//     //add chart storage tests here...
//     test('saveChart function saves chart with 3 datapoints, name, and color', () => {
//         //create
//         //code here
//         saveChart(1, null)  //should be save to location 0, since no other charts exist
//         //code to check if it worked
//     })
//     test('saveChart function replaces chart at index 0 with chart with 3 datapoints, name, and color', () => {
//         //create
//         //code here
//         saveChart(1, 0)
//         //code to check if it worked
//     })
// })

// describe('generateChartImg.js Unit Tests', () => {
//     //add generate chart image tests here...
// })

//sortPoints.js dependency
describe('sortPoints.js Unit Tests', () => {
    //notes:
    //  need to format as json? or can just supply list of points? (array of {x:..., y:...} datapoints)
    //  ready for testing?

    //add sort points test here...
    test('Sort points [(6, 10), (1,2), (7,11), (5,9)] to be [(1,2), (5,9), (6, 10), (7,11)]', () => {
        let givenPointsArray = [
            {x: 6, y: 10},
            {x: 1, y: 2},
            {x: 7, y: 11},
            {x: 5, y: 9}
        ];
        let expectedPointsArray = [
            {x: 1, y: 2},
            {x: 5, y: 9},
            {x: 6, y: 10},
            {x: 7, y: 11}
        ];
        expect(sortPoints(givenPointsArray)).toMatchObject(expectedPointsArray)
    })
    test('Sort points [(3, 11), (1,2), (7,8), (5,9)] to be [(1,2), (3, 11), (5,9), (7,8)]', () => {
        let givenPointsArray = [
            {x: 3, y: 11},
            {x: 1, y: 2},
            {x: 7, y: 8},
            {x: 5, y: 9}
        ];
        let expectedPointsArray = [
            {x: 1, y: 2},
            {x: 3, y: 11},
            {x: 5, y: 9},
            {x: 7, y: 8}
        ];
        expect(sortPoints(givenPointsArray)).toMatchObject(expectedPointsArray)
    })
})
