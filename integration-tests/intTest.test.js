/**
* @jest-environment jsdom
*/

// Libraries
require("@testing-library/jest-dom");
const domTesting = require("@testing-library/dom")
const userEvent = require("@testing-library/user-event").default
const fs = require("fs");

// Window alert is not implemented by jsdom
// Workaround found here: https://stackoverflow.com/questions/55088482/jest-not-implemented-window-alert
window.alert = jest.fn();

// Isolate modules for each test
function initDomFromFiles(htmlPath, jsPath) {
    const html = fs.readFileSync(htmlPath, 'utf8')
    document.open();
    document.write(html);
    document.close();
    jest.isolateModules(function() {
        require(jsPath);
    });
}

// Clears data for each test
beforeEach(function() {
    window.localStorage.clear();
});





/*
 *  First Test:
 *  Checks that clicking the plus button adds a new pair of input fields and doesn't affect previously inputted data
 *  This section tests two cases:
 *      When the user clicks the plus button, a new pair of input fields are created
 *      When the user clicks the plus button, their data isn't affected
 */
describe("1. Adding values in the chart builder", function() {
    test("Clicking on plus button creates a new pair of input fields", async function () {
        // Arrange:
        initDomFromFiles(`${__dirname}/../src/line/line.html`, `${__dirname}/../src/line/line.js`);

        // Acquire elments:
        let x = domTesting.queryAllByLabelText(document, "X");
        let y = domTesting.queryAllByLabelText(document, "Y");

        // Assert:
        // Make sure there is only one pair of input fields
        expect(x).toHaveLength(1);
        expect(y).toHaveLength(1);

        // Act:
        // Click the plus button to add another pair of input fields
        const plusButton = domTesting.getByText(document, "+");
        const user = userEvent.setup();
        await user.click(plusButton);

        // Assert:
        // Check that there are now two pairs of input fields
        x = domTesting.queryAllByLabelText(document, "X");
        y = domTesting.queryAllByLabelText(document, "Y");
        expect(x).toHaveLength(2);
        expect(y).toHaveLength(2);
    });

    test("Creating new input fields does not impact existing data", async function () {
        // Arrange:
        initDomFromFiles(`${__dirname}/../src/line/line.html`, `${__dirname}/../src/line/line.js`);

        // Acquire elements
        let x = domTesting.getByLabelText(document, "X");
        let y = domTesting.getByLabelText(document, "Y");
        const plusButton = domTesting.getByText(document, "+");

        // Act:
        // Add data to the fields and click the plus button
        const user = userEvent.setup();
        await user.type(x, "12");
        await user.type(y, "15");
        await user.click(plusButton);

        // Assert:
        // Check that there are two pairs of input fields
        x = domTesting.queryAllByLabelText(document, "X");
        y = domTesting.queryAllByLabelText(document, "Y");
        expect(x).toHaveLength(2);
        expect(y).toHaveLength(2);
        // And confirm data is unchanged
        expect(x[0].value).toBe("12");
        expect(y[0].value).toBe("15");
    });
});





/*
 *  Second Test:
 *  Checks that an alert is displayed if the user doesn't input x or y labels or doesn't input data
 *  This section tests three cases:
 *      If the user inputs labels but doesn't input data
 *      If the user inputs data but doesn't input labels
 *      If the user doesn't input either
 */
describe("2. Alerts displayed for missing chart data", function() {
    test("Inputting labels but no data displays an alert", async function () {
        // Arrange:
        initDomFromFiles(`${__dirname}/../src/line/line.html`, `${__dirname}/../src/line/line.js`);

        // Acquire elements
        const xLabelInputTextbox = domTesting.getByLabelText(document, "X label");
        const yLabelInputTextbox = domTesting.getByLabelText(document, "Y label");
        const xValueInputTextbox = domTesting.getByLabelText(document, "X");
        const yValueInputTextbox = domTesting.getByLabelText(document, "Y");
        const generateChartButton = domTesting.getByText(document, "Generate chart");

        // Alert spy
        const alertSpy = jest.spyOn(window, "alert");

        // Assert:
        // Check that textboxes are blank
        expect(xLabelInputTextbox.value).toBe("");
        expect(yLabelInputTextbox.value).toBe("");
        expect(xValueInputTextbox.value).toBe("");
        expect(yValueInputTextbox.value).toBe("");

        // Act:
        // Fill in axis labels and click on generate chart button
        const user = userEvent.setup();
        await user.type(xLabelInputTextbox, "This is an x label");
        await user.type(yLabelInputTextbox, "This is a y label");
        await user.click(generateChartButton);

        // Assert:
        // Check that the alert spy has been called
        expect(alertSpy).toHaveBeenCalled();
        window.alert.mockClear();
    });

    test("Inputting data but no labels displays an alert", async function () {
        // Arrange:
        initDomFromFiles(`${__dirname}/../src/line/line.html`, `${__dirname}/../src/line/line.js`);

        // Acquire elements
        const xLabelInputTextbox = domTesting.getByLabelText(document, "X label");
        const yLabelInputTextbox = domTesting.getByLabelText(document, "Y label");
        const xValueInputTextbox = domTesting.getByLabelText(document, "X");
        const yValueInputTextbox = domTesting.getByLabelText(document, "Y");
        const generateChartButton = domTesting.getByText(document, "Generate chart");

        // Alert spy
        const alertSpy = jest.spyOn(window, "alert");

        // Assert:
        // Check that textboxes are blank
        expect(xLabelInputTextbox.value).toBe("");
        expect(yLabelInputTextbox.value).toBe("");
        expect(xValueInputTextbox.value).toBe("");
        expect(yValueInputTextbox.value).toBe("");

        // Act:
        // Fills in values and click on generate chart button
        const user = userEvent.setup();
        await user.type(xValueInputTextbox, "12");
        await user.type(yValueInputTextbox, "15");
        await user.click(generateChartButton);

        // Assert:
        // Check that the alert spy has been called
        expect(alertSpy).toHaveBeenCalled();
        window.alert.mockClear();
    });

    test("Not inputting any data nor labels displays an alert", async function () {
        // Arrange:
        initDomFromFiles(`${__dirname}/../src/line/line.html`, `${__dirname}/../src/line/line.js`);

        // Acquire elements
        const xLabelInputTextbox = domTesting.getByLabelText(document, "X label");
        const yLabelInputTextbox = domTesting.getByLabelText(document, "Y label");
        const xValueInputTextbox = domTesting.getByLabelText(document, "X");
        const yValueInputTextbox = domTesting.getByLabelText(document, "Y");
        const generateChartButton = domTesting.getByText(document, "Generate chart");

        // Alert spy
        const alertSpy = jest.spyOn(window, "alert");

        // Assert:
        // Check that textboxes are blank
        expect(xLabelInputTextbox.value).toBe("");
        expect(yLabelInputTextbox.value).toBe("");
        expect(xValueInputTextbox.value).toBe("");
        expect(yValueInputTextbox.value).toBe("");

        // Act:
        // Click on the generate chart button
        const user = userEvent.setup();
        await user.click(generateChartButton);

        // Assert:
        // Check that the alert spy has been called
        expect(alertSpy).toHaveBeenCalled();
        window.alert.mockClear();
    });
})




/*
 *  Third Test:
 *  Checks that an alert is displayed if the user doesn't input x or y labels or doesn't input data
 *  This section tests one case:
 *      User fills inserts 4 more x y pair of inputs, fills in all textbox and color inputs,
 *      and clicks the "Clear chart data" button and observes that data is reset
 */
describe("3. Clearing chart data", function() {
    test("Input", async function () {
        // Arrange:
        initDomFromFiles(`${__dirname}/../src/line/line.html`, `${__dirname}/../src/line/line.js`);

        // Acquire elements:
        const chartTitleInput = domTesting.getByLabelText(document, "Chart title");
        const colorInput = domTesting.getByLabelText(document, "Chart color");
        const xLabelInputTextbox = domTesting.getByLabelText(document, "X label");
        const yLabelInputTextbox = domTesting.getByLabelText(document, "Y label");
        const plusButton = domTesting.getByText(document, "+");
        const clearChartData = domTesting.getByText(document, "Clear chart data")

        // Variable to check against initial color
        let originalColor = colorInput.value;

        // Act:
        // Click the plus button 4 times
        const user = userEvent.setup();
        for (let i = 0; i < 4; i++) {
            await user.click(plusButton);
        }

        // Assert:
        // Check that there are 5 pairs of value input fields
        let xValueInputs = domTesting.queryAllByLabelText(document, "X");
        let yValueInputs = domTesting.queryAllByLabelText(document, "Y");
        expect(xValueInputs).toHaveLength(5);
        expect(yValueInputs).toHaveLength(5);

        // Act:
        // Fill in all data
        await user.type(chartTitleInput, "Chart Title Here");
        await user.type(xLabelInputTextbox, "X Label Here");
        await user.type(yLabelInputTextbox, "Y Label Here");
        for (let i = 0; i < 5; i++) {
            await user.type(xValueInputs[i], "12");
            await user.type(yValueInputs[i], "15");
        }
        await domTesting.fireEvent.input(colorInput, {target: {value: "#ffffff"}})
        
        // Reset data
        await user.click(clearChartData);

        // Assert:
        // Check that all data is blank again
        expect(chartTitleInput.value).toBe("");
        expect(xLabelInputTextbox.value).toBe("");
        expect(yLabelInputTextbox.value).toBe("");
        expect(colorInput.value).toBe(originalColor);

        // Check that there is only one pair of data input fields
        xValueInputs = domTesting.queryAllByLabelText(document, "X");
        yValueInputs = domTesting.queryAllByLabelText(document, "Y");
        expect(xValueInputs).toHaveLength(1);
        expect(yValueInputs).toHaveLength(1);
    });
});





/*
 *  Fourth Test:
 *  Checks that data is correctly sent to the generateChartImg function
 *  This section tests one case:
 *      User fills inserts 4 more x y pair of inputs, fills in all textbox and color inputs,
 *      and clicks on "Generate chart" and checks to see if parameters are correctly passsed
 *      in the stubbed "generateChartImg" function.
 */
describe("4: Data is sent correctly to the generateChartImg function", function() {
    test("Checks each argument passed when user fills in data and generates chart.", async function() {
        // Stub generateCharImg function
        jest.mock("../src/lib/generateChartImg.js");
        const generateChartImgStub = require("../src/lib/generateChartImg");
        generateChartImgStub.mockImplementation(function() {
            return "http://placekitten.com/480/480";
        })

        // Arrange:
        initDomFromFiles(`${__dirname}/../src/line/line.html`, `${__dirname}/../src/line/line.js`);

        // Acquire elements:
        const chartTitleInput = domTesting.getByLabelText(document, "Chart title");
        const colorInput = domTesting.getByLabelText(document, "Chart color");
        const xLabelInputTextbox = domTesting.getByLabelText(document, "X label");
        const yLabelInputTextbox = domTesting.getByLabelText(document, "Y label");
        const plusButton = domTesting.getByText(document, "+");
        const generateChartButton = domTesting.getByText(document, "Generate chart")

        // Act:
        // Click the plus button 4 times
        const user = userEvent.setup();
        for (let i = 0; i < 4; i++) {
            await user.click(plusButton);
        }

        // Acquire more elements:
        let xValueInputs = domTesting.queryAllByLabelText(document, "X");
        let yValueInputs = domTesting.queryAllByLabelText(document, "Y");

        // Act:
        // Fill in input fields
        await user.type(chartTitleInput, "Chart Title Here");
        await user.type(xLabelInputTextbox, "X Label Here");
        await user.type(yLabelInputTextbox, "Y Label Here");
        for (let i = 0; i < 5; i++) {
            await user.type(xValueInputs[i], String(i));
            await user.type(yValueInputs[i], String(i));
        }
        await domTesting.fireEvent.input(colorInput, {target: {value: "#000000"}})
        await user.click(generateChartButton);

        // Assert:
        // Stub has been called once
        expect(generateChartImgStub).toHaveBeenCalledTimes(1);

        // Check that parameters are correctlyp passed to stub
        let data = [
            {x: "0", y: "0"},
            {x: "1", y: "1"},
            {x: "2", y: "2"},
            {x: "3", y: "3"},
            {x: "4", y: "4"},
        ]
        let parameters = generateChartImgStub.mock.calls[0];
        expect(parameters[0]).toBe("line");
        expect(parameters[1]).toStrictEqual(data);
        expect(parameters[2]).toBe("X Label Here");
        expect(parameters[3]).toBe("Y Label Here");
        expect(parameters[4]).toBe("Chart Title Here");
        expect(parameters[5]).toBe("#000000");

        generateChartImgStub.mockRestore();
    });
});
