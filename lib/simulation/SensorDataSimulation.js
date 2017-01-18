export default function simulatedata(sensortype,sinvalue)
{
    let deflection = 0.5;
    let displacement = -7;
    let verticality = 0;
    let strain = 7.1;
    let cableforce = 950;
    let x = 35;
    let y = 40;
    let z = -998;
    let temperature = 10;
    let humidity = 35;
    let corrosion = 0.01;
    let value;
    let lane = 1;
    let index = 1;
    let axesvelocityvalue = 0;

    if(sensortype === "01")
    {
        displacement += Math.random()*20 - 10;
        if (displacement > 0)
        {
            displacement = -7;
        }
        else if (displacement < -30)
        {
            displacement = -10;
        }
        displacement = Math.round(displacement * 100) / 100;
        value = {"displacement":displacement};
    }
    else if(sensortype === "02")
    {
        deflection += Math.random()*2- 1;
        if (deflection > 2)
        {
            deflection = 1.87;
        }
        else if (deflection < 0)
        {
            deflection = 0.32;
        }
        deflection = Math.round(deflection * 100) / 100;
        value = {"deflection":deflection};
    }
    else if(sensortype === "03")
    {
        verticality += Math.random()*0.1 - 0.05;
        if (verticality > 2)
        {
            verticality = 0.5;
        }
        else if (verticality < -2)
        {
            verticality = -0.3;
        }
        verticality = Math.round(verticality * 100) / 100;
        value = {"verticality":verticality};
    }
    else if(sensortype === "04")
    {
        strain += Math.random() - 0.5;
        if (strain > 10)
        {
            strain = 9.7;
        }
        else if (strain < 6)
        {
            strain = 6.31;
        }
        strain = Math.round(strain * 100) / 100;
        value = {"strain":strain};
    }
    else if(sensortype === "05")
    {
        cableforce += Math.random()*600 - 300;
        if (cableforce > 1500)
        {
            cableforce = 870;
        }
        else if (cableforce < 800)
        {
            cableforce = 935;
        }
        cableforce = Math.round(cableforce * 10) / 10;
        value = {"cableforce":cableforce};
    }
    else if(sensortype === "06")
    {
        x += Math.random()*100 - 50;
        y += Math.random()*100 - 50;
        z += Math.random()*100 - 50;
        if (x > 300)
        {
            x = 289;
        }
        else if (x < 0)
        {
            x = 15;
        }
        x = Math.round(x * 10) / 10;
        if (y > 300)
        {
            y = 289;
        }
        else if (y < 0)
        {
            y = 15;
        }
        y = Math.round(y * 10) / 10;
        if (z > -700)
        {
            z = -721;
        }
        else if (z < -1300)
        {
            z = -1287;
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
        if (humidity > 90)
        {
            humidity = 75;
        }
        else if (humidity < 10)
        {
            humidity = 28;
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
        let weightlimit = 45000;
        let overweight;
        let overweighttag;
        let axesweight = [0,0,0,0,0,0,0,0];
        for (let i = 0; i < axesnumber; i++)
        {
            if (i == 0)
            {
                let axesweightvalue = Math.round(Math.random()*1000);
                if(axesweightvalue < 500)
                {
                    axesweightvalue = axesweightvalue + 300;
                }
                axesweight[i] = axesweightvalue;
            }else if (i == axesnumber-1)
            {
                let axesweightvalue = Math.round(Math.random()*1000);
                if(axesweightvalue < 500)
                {
                    axesweightvalue = axesweightvalue + 300;
                }
                axesweight[i] = axesweightvalue;
            }else
            {
                let axesweightvalue = Math.round(Math.random()*5000);
                if(axesweightvalue < 1000)
                {
                    axesweightvalue = axesweightvalue + 1000;
                }
                axesweight[i] = axesweightvalue;
            }
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
            if (i == 0)
            {
                axesvelocityvalue = Math.round(Math.random()*120);
                axesvelocity[i] = axesvelocityvalue;

            }else{
                axesvelocityvalue = axesvelocityvalue + Math.round(Math.random()*12) - 6;
                axesvelocity[i] = axesvelocityvalue;
            }
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


