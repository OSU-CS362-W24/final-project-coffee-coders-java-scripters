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
const fs = require("fs")  //needed for initDomFromFiles()
const domTesting = require('@testing-library/dom')
require('@testing-library/jest-dom') //don't need to store it b/c only augmenting
// const userEvent = require("@testing-library/user-event").default
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

describe('chartStorage.js Unit Tests', () => {
    //saveChart (doesn't care about incomplete charts)
    test('saveChart function saves chart with 3 datapoints, name, and color', () => {
        //Arrange
        window.localStorage.clear()  //clear local storage
        const chartList = [
            {
                type: "line",
                data: [
                    {x: 1, y: 2},
                    {x: 5, y: 9},
                    {x: 6, y: 10},
                    {x: 7, y: 11}
                ],
                xLabel: "Time",
                yLabel: "Temperature",
                title: "Summer Temperatures, 2023",
                color: "red"
            }
        ];
        const newChart = {
            type: "bar",
            data: [
                {x: 2, y: 3},
                {x: 6, y: 10},
                {x: 7, y: 11}
            ],
            xLabel: "Month",
            yLabel: "Rainfall (cm)",
            title: "Summer Rainfall, 2023",
            color: "blue"
        }
        window.localStorage.setItem("savedCharts", JSON.stringify(chartList))

        //Act
        saveChart(newChart, null)  //should be save to location 0, since no other charts exist
        
        //Assert
        expect(JSON.parse(window.localStorage.getItem("savedCharts")).length).toBe(2)
        expect(JSON.parse(window.localStorage.getItem("savedCharts"))[1]).toMatchObject(newChart)
    })
    test('saveChart function replaces chart at index 0 with chart with 3 datapoints, name, and color', () => {
        //Arrange
        window.localStorage.clear()
        const chartList = [
            {
                type: "line",
                data: [
                    {x: 1, y: 2},
                    {x: 5, y: 9},
                    {x: 6, y: 10},
                    {x: 7, y: 11}
                ],
                xLabel: "Time",
                yLabel: "Temperature",
                title: "Summer Temperatures, 2023",
                color: "red"
            }
        ];
        const newChart = {
            type: "bar",
            data: [
                {x: 2, y: 3},
                {x: 6, y: 10},
                {x: 7, y: 11}
            ],
            xLabel: "Month",
            yLabel: "Rainfall (cm)",
            title: "Summer Rainfall, 2023",
            color: "blue"
        };
        window.localStorage.setItem("savedCharts", JSON.stringify(chartList))
        
        //Act
        saveChart(newChart, 0)  //should be save to location 0, since no other charts exist
        
        //Assert
        expect(JSON.parse(window.localStorage.getItem("savedCharts")).length).toBe(1)
        expect(JSON.parse(window.localStorage.getItem("savedCharts"))[0]).toMatchObject(newChart)
    })
    //one more test for idx > charts.length?

    //loadAllSavedCharts
    test('loadAllSavedCharts returns an empty array when no charts are saved', () => {
        //Assert
        window.localStorage.clear()
        expect(loadAllSavedCharts()).toMatchObject([])  //need to make that an empty array?
    })
    test('loadAllSavedCharts returns 3 charts test (in same order as on input)', () => {
        //Arrange
        window.localStorage.clear()
        const chartList = [
            {
                type: "line",
                data: [
                    {x: 1, y: 2},
                    {x: 5, y: 9},
                    {x: 6, y: 10},
                    {x: 7, y: 11}
                ],
                xLabel: "Time",
                yLabel: "Temperature",
                title: "Summer Temperatures, 2023",
                color: "red"
            },
            {
                type: "bar",
                data: [
                    {x: 2, y: 3},
                    {x: 6, y: 10},
                    {x: 7, y: 11}
                ],
                xLabel: "Month",
                yLabel: "Rainfall (cm)",
                title: "Summer Rainfall, 2023",
                color: "blue"
            },
            {
                type: "scatter",
                data: [
                    {x: 3, y: 4},
                    {x: 7, y: 11},
                    {x: 8, y: 12}
                ],
                xLabel: "longitude",
                yLabel: "lattitude",
                title: "Bear Sightings, Summer 2023",
                color: "black"
            }
        ];
        window.localStorage.setItem("savedCharts", JSON.stringify(chartList))

        //Assert
        expect(loadAllSavedCharts()).toMatchObject(chartList)  //need to make that an empty array?
    })

    //loadSavedChart
    test('loadSavedChart returns an empty chart when no charts are saved', () => {
        //Assert
        window.localStorage.clear()
        expect(loadSavedChart(1)).toMatchObject({})  //need to make that an empty array?
    })
    test('loadSavedChart returns an empty chart when chart\'s idx is beyond array range', () => {
        //Assert
        window.localStorage.clear()
        const chartList = [
            {
                type: "line",
                data: [
                    {x: 1, y: 2},
                    {x: 5, y: 9},
                    {x: 6, y: 10},
                    {x: 7, y: 11}
                ],
                xLabel: "Time",
                yLabel: "Temperature",
                title: "Summer Temperatures, 2023",
                color: "red"
            }
        ]
        window.localStorage.setItem("savedCharts", JSON.stringify(chartList))

        //Assert
        expect(loadSavedChart(2)).toMatchObject({})  //need to make that an empty array?
    })
    test('loadAllSavedCharts returns 3 charts test (in same order as on input)', () => {
        //Arrange
        window.localStorage.clear()
        const chartList = [
            {
                type: "line",
                data: [
                    {x: 1, y: 2},
                    {x: 5, y: 9},
                    {x: 6, y: 10},
                    {x: 7, y: 11}
                ],
                xLabel: "Time",
                yLabel: "Temperature",
                title: "Summer Temperatures, 2023",
                color: "red"
            },
            {
                type: "bar",
                data: [
                    {x: 2, y: 3},
                    {x: 6, y: 10},
                    {x: 7, y: 11}
                ],
                xLabel: "Month",
                yLabel: "Rainfall (cm)",
                title: "Summer Rainfall, 2023",
                color: "blue"
            },
            {
                type: "scatter",
                data: [
                    {x: 3, y: 4},
                    {x: 7, y: 11},
                    {x: 8, y: 12}
                ],
                xLabel: "longitude",
                yLabel: "lattitude",
                title: "Bear Sightings, Summer 2023",
                color: "black"
            }
        ];
        window.localStorage.setItem("savedCharts", JSON.stringify(chartList))

        //Assert
        expect(loadSavedChart(1)).toMatchObject(chartList[1])  //need to make that an empty array?
    })
    //could add border cases?

    //updateCurrentChartData
        //only that it saves?
        //could do cases that are missing data, but idk that's necessary?
    test('updateCurrentChartData saves the given chart in local storage', () => {
        //Assert
        window.localStorage.clear()
        const currChart = {
            type: "line",
            data: [
                {x: 1, y: 2},
                {x: 5, y: 9},
                {x: 6, y: 10},
                {x: 7, y: 11}
            ],
            xLabel: "Time",
            yLabel: "Temperature",
            title: "Summer Temperatures, 2023",
            color: "red"
        }
        
        //Act
        updateCurrentChartData(currChart)
        window.localStorage.setItem("currentChartData", JSON.stringify(currChart))  //need stringify for obj rather than list?

        //Assert
        expect(JSON.parse(window.localStorage.getItem("currentChartData"))).toMatchObject(currChart)  //need to make that an empty array?
    })
    
    //loadCurrentChartData
        //only that it loads?
        //could do cases that are missing data, but idk that's necessary?
    test('loadCurrentChartData loads the expected chart from local storage', () => {
        //Assert
        window.localStorage.clear()
        const currChart = {
            type: "line",
            data: [
                {x: 1, y: 2},
                {x: 5, y: 9},
                {x: 6, y: 10},
                {x: 7, y: 11}
            ],
            xLabel: "Time",
            yLabel: "Temperature",
            title: "Summer Temperatures, 2023",
            color: "red"
        }
        window.localStorage.setItem("currentChartData", JSON.stringify(currChart))  //need stringify for obj rather than list?

        //Assert
        expect(loadCurrentChartData()).toMatchObject(currChart)  //need to make that an empty array?
    })
})

// describe('generateChartImg.js Unit Tests', () => {
//      //add generate chart image tests here...
//      //can't test url match previous tests (changes with each function call)
//      //try matching image to previous image (pixel for pixel)?
//      //or just test that it's a url?
//      //failure returns null or undefined?
//      test('generateChartImg function generates an image with valid input', () => {
//         //set inputs
//         let pointsArray = [
//             {x: 1, y: 2},
//             {x: 5, y: 9},
//             {x: 6, y: 10},
//             {x: 7, y: 11}
//         ];
//         //doesn't like the function call, issues with fetch not defined?
//         expect(generateChartImg("line", pointsArray, "Time", "Temperature", "Summer Temperatures, 2023", "blue")).not.toBe(undefined)
//      })
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
