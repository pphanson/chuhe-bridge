export default function simulatedata(sensortype)
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
        value = {"baseband":cableforce};
    }
    else if(sensortype === "06")
    {
        x += Math.random()*100 - 50;
        y += Math.random()*100 - 50;
        z += Math.random()*100 - 50;
        if (x > 700)
        {
            x = 700;
        }
        else if (x < 0)
        {
            x = 0;
        }
        x = Math.round(x * 10) / 10;
        if (y > 700)
        {
            y = 700;
        }
        else if (y < 0)
        {
            y = 0;
        }
        y = Math.round(y * 10) / 10;
        if (z > 700)
        {
            z = 700;
        }
        else if (z < 0)
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
        weight += Math.random()*100 - 50;
        if (weight > 600)
        {
            weight = 600;
        }
        else if (weight < 10)
        {
            weight = 10;
        }
        weight = Math.round(weight * 10) / 10;
        value = {"weight":weight};
    }
    return value;
}


