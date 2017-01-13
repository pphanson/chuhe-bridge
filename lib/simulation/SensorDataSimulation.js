export default function simulatedata(sensortype,sinvalue)
{
    let deflection = 5;
    let displacement = 10;
    let verticality = 90;
    let strain = 0.5;
    let cableforce = 650;
    let x = 100;
    let y = 100;
    let z = 100;
    let temperature = 10;
    let humidity = 30;
    let corrosion = 0.01;
    let weight = 100;
    let value;
    let lane = 1;
    let index = 1;

    if(sensortype === "01")
    {
        displacement += Math.random() - 0.5;
        if (displacement > 50)
        {
            displacement = 50;
        }
        else if (displacement < 0)
        {
            displacement = 0;
        }
        displacement = Math.round(displacement * 100) / 100;
        value = {"displacement":displacement};
    }
    else if(sensortype === "02")
    {
        deflection += Math.random()- 0.5;
        if (deflection > 50)
        {
            deflection = 50;
        }
        else if (deflection < -10)
        {
            deflection = -10;
        }
        deflection = Math.round(deflection * 100) / 100;
        value = {"deflection":deflection};
    }
    else if(sensortype === "03")
    {
        verticality += Math.random()*0.1 - 0.05;
        if (verticality > 90)
        {
            verticality = 90;
        }
        else if (verticality < 87)
        {
            verticality = 87;
        }
        verticality = Math.round(verticality * 100) / 100;
        value = {"verticality":verticality};
    }
    else if(sensortype === "04")
    {
        strain += Math.random()*0.1 - 0.05;
        if (strain > 2)
        {
            strain = 2;
        }
        else if (strain < 0)
        {
            strain = 0;
        }
        strain = Math.round(strain * 100) / 100;
        value = {"strain":strain};
    }
    else if(sensortype === "05")
    {
        cableforce += Math.random()*10 - 5;
        if (cableforce > 700)
        {
            cableforce = 700;
        }
        else if (cableforce < 500)
        {
            cableforce = 500;
        }
        cableforce = Math.round(cableforce * 10) / 10;
        value = {"cableforce":cableforce};
    }
    else if(sensortype === "06")
    {
        x = Math.sin(sinvalue* 0.017453293 )*100 + Math.random()*100 - 50;
        y = Math.sin(sinvalue* 0.017453293 )*100 + Math.random()*100 - 50;
        z = Math.sin(sinvalue* 0.017453293 )*100 + Math.random()*100 - 50;
        if (x > 700)
        {
            x = 700;
        }
        else if (x < -700)
        {
            x = -700;
        }
        x = Math.round(x * 10) / 10;
        if (y > 700)
        {
            y = 700;
        }
        else if (y < -700)
        {
            y = -700;
        }
        y = Math.round(y * 10) / 10;
        if (z > 700)
        {
            z = 700;
        }
        else if (z < -700)
        {
            z = 0;
        }
        z = Math.round(z * 10) / 10;
        value = {"x":x ,"y":y,"z":z};
    }
    else if(sensortype === "07")
    {
        temperature += Math.random() - 0.5;
        if (temperature > 15)
        {
            temperature = 15;
        }
        else if (temperature < 0)
        {
            temperature = 0;
        }
        temperature = Math.round(temperature * 10) / 10;

        humidity += Math.random() - 0.5;
        if (humidity > 50)
        {
            humidity = 50;
        }
        else if (humidity < 10)
        {
            humidity = 10;
        }
        humidity = Math.round(humidity * 10) / 10;
        value = {"temperature":temperature,"humidity":humidity};
    }
    else if(sensortype === "08")
    {
        corrosion = 0.01;
        value = {"corrosion":corrosion};
    }
    else if(sensortype === "09")
    {
        let datalength = 153;
        let id = '0901000000000000';
        if (lane == 1){
            lane = 2;
        }else{
            lane = 1;
        }
        let licenseplate;
        if (index === 1){
            licenseplate = '苏AR9U67';
            index++;
        }else if(index === 2)
        {
            licenseplate = '苏A21138';
            index++;
        }else if(index === 3)
        {
            licenseplate = '苏C35513';
            index++;
        }else if(index === 4)
        {
            licenseplate = '苏KA6189';
            index++;
        }else if(index === 5)
        {
            licenseplate = '苏K16155';
            index++;
        }else if(index === 6)
        {
            licenseplate = '苏K22345';
            index++;
        } else if(index === 7)
        {
            licenseplate = '苏AZ12381';
            index = 1;
        }
        let axesnumber = Math.round(Math.random()*10);
        if (axesnumber == 0 || axesnumber == 1 || axesnumber == 9){
            axesnumber = 2;
        }
        let weight;
        let time = 20160101092020;
        let weightlimit = 2000;
        let overweight;
        let overweighttag;
        let axesweight = [0,0,0,0,0,0,0,0];
        for (let i = 0; i < axesnumber; i++)
        {
            axesweight[i] = Math.round(Math.random()*1000);
        }
        weight = axesweight[0] + axesweight[1] + axesweight[2] + axesweight[3]
        + axesweight[4] + axesweight[5] + axesweight[6] + axesweight[7];
        overweight = weight - weightlimit;
        if (overweight <= 0){
            overweight = 0;
            overweighttag = 0;
        }else{
            overweighttag = 1;
        }
        let axesvelocity = [0,0,0,0,0,0,0,0];
        for (let i = 0; i < axesnumber; i++)
        {
            axesvelocity[i] = Math.round(Math.random()*200);
        }
        let shaftspacing = [0,0,0,0,0,0,0,0];
        for (let i = 0; i < axesnumber-1; i++)
        {
            shaftspacing[i] = 200;
        }
        let totalwheelbase = 200;
        let carlength = 200;
        let fronthanginglong = 200;
        let afterhanginglong = 200;
        let vehiclespacing = 200;
        let direction = 0;
        let vehicletype = 1;
        let violationtype = 0;
        let temperature = 5;
        let correctnesstype = 0;
        let vehiclespacingtime = 17;
        let axesgroupweight = [0,0,0,0,0,0,0,0];
        for (let i = 0; i < axesnumber; i++)
        {
            axesgroupweight[i] = Math.round(Math.random()*1000);
        }
        let axesequivalentload = [0,0,0,0,0,0,0,0];
        for (let i = 0; i < axesnumber; i++)
        {
            axesequivalentload[i] = Math.round(Math.random()*1000);
        }
        let passingtime = 17;
        let acrosstag = 0;
        value = {
            "datalength": datalength,
            "id":id,
            "lane":lane,
            "licenseplate":licenseplate,
            "axesnumber": axesnumber,
            "weight":weight,
            "time":time,
            "weightlimit": weightlimit,
            "overweight":overweight,
            "axesweight1":axesweight[0],
            "axesweight2": axesweight[1],
            "axesweight3":axesweight[2],
            "axesweight4":axesweight[3],
            "axesweight5": axesweight[4],
            "axesweight6":axesweight[5],
            "axesweight7":axesweight[6],
            "axesweight8": axesweight[7],
            "axesvelocity1":axesvelocity[0],
            "axesvelocity2":axesvelocity[1],
            "axesvelocity3":axesvelocity[2],
            "axesvelocity4":axesvelocity[3],
            "axesvelocity5":axesvelocity[4],
            "axesvelocity6": axesvelocity[5],
            "axesvelocity7":axesvelocity[6],
            "axesvelocity8":axesvelocity[7],
            "shaftspacing12":shaftspacing[0],
            "shaftspacing23":shaftspacing[1],
            "shaftspacing34":shaftspacing[2],
            "shaftspacing45":shaftspacing[3],
            "shaftspacing56":shaftspacing[4],
            "shaftspacing67":shaftspacing[5],
            "shaftspacing78":shaftspacing[6],
            "totalwheelbase":totalwheelbase,
            "carlength":carlength,
            "fronthanginglong":fronthanginglong,
            "afterhanginglong":afterhanginglong,
            "vehiclespacing":vehiclespacing,
            "direction":direction,
            "vehicletype":vehicletype,
            "violationtype":violationtype,
            "temperature":temperature,
            "correctnesstype":correctnesstype,
            "vehiclespacingtime":vehiclespacingtime,
            "axesgroupweight1":axesgroupweight[0],
            "axesgroupweight2":axesgroupweight[1],
            "axesgroupweight3":axesgroupweight[2],
            "axesgroupweight4":axesgroupweight[3],
            "axesgroupweight5":axesgroupweight[4],
            "axesgroupweight6":axesgroupweight[5],
            "axesgroupweight7":axesgroupweight[6],
            "axesgroupweight8":axesgroupweight[7],
            "axesequivalentload1":axesequivalentload[0],
            "axesequivalentload2":axesequivalentload[1],
            "axesequivalentload3":axesequivalentload[2],
            "axesequivalentload4":axesequivalentload[3],
            "axesequivalentload5":axesequivalentload[4],
            "axesequivalentload6":axesequivalentload[5],
            "axesequivalentload7":axesequivalentload[6],
            "axesequivalentload8":axesequivalentload[7],
            "passingtime":passingtime,
            "acrosstag":acrosstag,
            "overweighttag":overweighttag
        };
    }
    return value;
}


