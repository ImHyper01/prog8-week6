import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

let accuracyField = document.getElementById("accuracy");
let totalAmount = 0
let amountCorrect = 0

let correctPositive = 0;    
let falseNegative = 0;
let falsePositive = 0;
let correctNegative = 0;

let correctPositiveField = document.getElementById("correctPositive");
let falsePositiveField = document.getElementById("falsePositive");
let correctNegativeField = document.getElementById("correctNegative");
let falseNegativeField = document.getElementById("falseNegative");


//
// DATA
//
const csvFile = "./data/diabetes.csv"
const trainingLabel = ""  
const ignored = ['SkinThickness']
const maxTreeDepth = 200;  

//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)   // gebruik deze data om te trainen
    })
}



//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    // todo : splits data in traindata en testdata

    data.sort(() => (Math.random() - 0.5))

    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)


    let decisionTree = new DecisionTree({
        ignoredAttributes: ['SkinThickness'],    
        trainingSet: trainData,
        categoryAttr: "Age"          
    });

    // teken de tree
    // // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
     let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())


    // todo : maak een prediction met een sample uit de testdata
    
        let diabetes = testData[0]
        let diabetesPrediction = decisionTree.predict(diabetes)
        console.log(`Has diabetes : ${diabetesPrediction}`)
    

    // todo : bereken de accuracy met behulp van alle test data
    for (let i = 0; i < testData.length; i++) {
        testPatient(testData[i], decisionTree);
      }

    
    let json = decisionTree.toJSON()
    console.log(JSON.stringify(json))


    function testPassenger(patient, decisionTree) {
        // kopie van passenger maken, zonder het "survived" label
        const patientWithoutLabel = { ...patient }
        delete patientWithoutLabel.Label
    
        // prediction
        let prediction = decisionTree.predict(patientWithoutLabel)
    
        // vergelijk de prediction met het echte label
        let message = (prediction === patient.survived) ? "goed voorspeld!" : "fout voorspeld!"
        console.log(message)
    }
    
    testPassenger(testData[0])

}


loadData()