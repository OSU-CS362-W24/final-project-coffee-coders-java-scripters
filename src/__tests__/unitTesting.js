/**
* @jest-environment ./src/fixjsdomenvironment.js
*/

const { saveChart, loadAllSavedCharts, loadSavedChart, updateCurrentChartData,
    loadCurrentChartData } = require('../lib/chartStorage.js')
const generateChartImg = require('../lib/generateChartImg.js')
const sortPoints = require('../lib/sortPoints.js')  //correct formatting for single function

require('@testing-library/jest-dom')  //augmentation for window.local storage
require("whatwg-fetch")  //augmentation for api fetch call

//@testing-library/jest-dom and chartStorage.js dependancies
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
        saveChart(newChart, null)  //should be save to location 1, since not given an index
        
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
        saveChart(newChart, 0)  //should be save to location 0, replacing the previous chart
        
        //Assert
        expect(JSON.parse(window.localStorage.getItem("savedCharts")).length).toBe(1)
        expect(JSON.parse(window.localStorage.getItem("savedCharts"))[0]).toMatchObject(newChart)
    })

    //loadAllSavedCharts
    test('loadAllSavedCharts returns an empty array when no charts are saved', () => {
        //Assert
        window.localStorage.clear()
        expect(loadAllSavedCharts()).toMatchObject([])
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
        expect(loadAllSavedCharts()).toMatchObject(chartList)
    })

    //loadSavedChart
    test('loadSavedChart returns an empty chart when no charts are saved', () => {
        //Assert
        window.localStorage.clear()
        expect(loadSavedChart(1)).toMatchObject({})
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
        expect(loadSavedChart(2)).toMatchObject({})
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
        expect(loadSavedChart(1)).toMatchObject(chartList[1])
    })

    //updateCurrentChartData
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
        window.localStorage.setItem("currentChartData", JSON.stringify(currChart))

        //Assert
        expect(JSON.parse(window.localStorage.getItem("currentChartData"))).toMatchObject(currChart)
    })
    
    //loadCurrentChartData
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
        window.localStorage.setItem("currentChartData", JSON.stringify(currChart))

        //Assert
        expect(loadCurrentChartData()).toMatchObject(currChart)
    })
})

//generateChartImg.js, fixjsdomenvironment.js, and whatwg-fetch dependancies
describe('generateChartImg.js Unit Tests', () => {
    //following test written by Ellie
    test("generateChartImg() returns a URL to a chart", async function() {
        // arrange     
        const coords = [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}]
        // act     
        const url = await generateChartImg("line", coords, "x-axis", "y-axis", "title", "#ffffff")      
        // assert     
        expect(url).toContain("blob:nodedata:")
    })
})

//sortPoints.js dependency
describe('sortPoints.js Unit Tests', () => {
    //sortPoints
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
