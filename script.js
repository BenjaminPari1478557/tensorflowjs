let model;
    const columnas = [
      'Age', 'MonthlyIncome', 'TotalWorkingYears', 'YearsAtCompany',
      'JobRole_Human Resources', 'JobRole_Laboratory Technician', 'JobRole_Manager',
      'JobRole_Manufacturing Director', 'JobRole_Research Director', 'JobRole_Research Scientist',
      'JobRole_Sales Executive', 'JobRole_Sales Representative',
      'OverTime_Yes',
      'BusinessTravel_Travel_Frequently', 'BusinessTravel_Travel_Rarely'
    ];

    async function cargarModelo() {
      model = await tf.loadLayersModel("/model.json");
      console.log("Modelo cargado");
    }

    function predecir() {
      const edad = parseFloat(document.getElementById("age").value);
      const ingreso = parseFloat(document.getElementById("income").value);
      const totalYears = parseFloat(document.getElementById("totalYears").value);
      const yearsAtCompany = parseFloat(document.getElementById("yearsAtCompany").value);
      const jobRole = document.getElementById("jobRole").value;
      const overtime = document.getElementById("overtime").value;
      const businessTravel = document.getElementById("businessTravel").value;

      // One-hot encoding manual
      const entrada = [];

      // Numéricas directas
      entrada.push(edad, ingreso, totalYears, yearsAtCompany);

      // JobRole (8 columnas)
      const roles = [
        'Human Resources', 'Laboratory Technician', 'Manager',
        'Manufacturing Director', 'Research Director', 'Research Scientist',
        'Sales Executive', 'Sales Representative'
      ];
      roles.forEach(r => entrada.push(jobRole === r ? 1 : 0));

      // OverTime_Yes
      entrada.push(overtime === "Yes" ? 1 : 0);

      // BusinessTravel (2 columnas: Travel_Frequently, Travel_Rarely)
      entrada.push(businessTravel === "Travel_Frequently" ? 1 : 0);
      entrada.push(businessTravel === "Travel_Rarely" ? 1 : 0);

      const inputTensor = tf.tensor2d([entrada]);
      const pred = model.predict(inputTensor);
      pred.array().then(r => {
        const probabilidad = r[0][0];
        document.getElementById("resultado").innerText =
          `Probabilidad de abandono: ${(probabilidad * 100).toFixed(2)}%`;
      });
    }

    cargarModelo();