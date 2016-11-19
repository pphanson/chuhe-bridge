import sensors from "../sensors";
import express from "express";

const router = express.Router();


function getSensors()
{
    let result = {};
    let s = sensors.getSensors();
    for (let i = 0; i < s.length; i++)
    {
        let sensor = s[i];
        let type = sensor.meta.name;

        if (result[type] === null || result[type] === undefined)
        {
            result[type] = [];
        }

        result[type].push({
          id: sensor.id,
          name: "sensor-" + sensor.id
        });
    }
    return result;
}


router.get("/sensors", (req, res) => {
  res.send(getSensors());
});

export default router;
