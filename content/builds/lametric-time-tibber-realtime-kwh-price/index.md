---
title: My realtime kWh price on LaMetric Time
date: 2023-09-14T11:45:03+02:00
resources:
  - src: LaMetric Time x Tibber_web.jpg
    name: feature
    title: My LaMetric Time showing my current kWh price from Tibber
---

Let me take you on a journey. A journey through time: LaMetric Time. Let me take you on my journey through LaMetric Time in which I built a display to show my realtime electricity price in my kitchen.

I buy my electricity from [Tibber](https://tibber.com/) and they have not paid me (yet) to write this tutorial. But they do have an API and since my kWh-price changes every hour, I thought it would be neat to show it realtime in my house. My idea was that if it's high, I would delay whatever energy-intensive thing I was about to do until the price comes back down.

Our endgame is going to be this:

{{< video name="LaMetric Time x Tibber_web" >}}

What you'll need to get there:

- One [LaMetric Time](https://lametric.com/). I got mine retail for €199.99
- A [LaMetric Developer account](https://developer.lametric.com/) (free)
- A [Tibber API key](https://developer.tibber.com/docs/overview) (free)
- A web server or a serverless lambda function (not free)
- Moderate copy/paste abilities

Let's get crackin'!

{{< figure src="electricity.gif" title="🎶 I'ma love you differently / I'll give you electricity" >}}

## Step 1. Create a LaMetric app

First things first. For my build, I chose to create an actual LaMetric app. But I'm not gonna lie, it requires coding skills. If that isn't you, worry not! You can skip this tutorial and open the LaMetric Time app on your phone and install the _My Data DIY_ app. It will look and work not as good as a dedicated app, but will get the job done without any code!

If you are ready to get your hands a little dirty, so to speak, read on.

On the [developer portal](https://developer.lametric.com/applications/create), create an **Indicator App**.

{{< figure src="LaMetric developer - Create Indicator app.png" >}}

### Create user interface

This will be the initial screen of your app, before the Tibber price is loaded.

1. Make sure a 'Name' frame is selected (not a Metric, Goal or Sparkline)
2. Choose an icon. If you search for Tibber you'll find the one I created
3. Enter text: € --

### Select communication type

This should be set to Poll.

### LaMetric will poll your server for data

1. URL to get data from, see below
2. Poll frequency: 5 min
3. Data format:

```json
{
    "frames": [
        {
            "text": "€ --",
            "icon": 53229
        }
    ]
}
```

## Step 2. Create a web server

We have to create an URL to get data from.

This is probably the most difficult part. You are going to need a web server to sit in between Tibber and LaMetric. You see, they don't understand each other directly so you need something to translate between them. I chose to create a [Netlify](https://www.netlify.com/) website for this that has a serveless function inside. You can use something else too. All it has to do, is read JSON from Tibber and write JSON in a format that LaMetric understands.

The source code to my website is here: <https://github.com/spacebabies/lametric.jotocorp.com>. Feel free to copy it, reuse it, or be inspired by it. It is written in JavaScript (mostly).

The serverless function I created is this one:

```js
import fetch from 'node-fetch';

const token = process.env.TIBBER_ACCESS_TOKEN;
const API_ENDPOINT = `https://api.tibber.com/v1-beta/gql`;
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': "application/json"
};
const query = `{
  viewer {
    homes {
      currentSubscription{
        priceInfo{
          current{
            total
            level
          }
          today{
            total
            startsAt
          }
          tomorrow{
            total
            startsAt
          }
        }
      }
    }
  }
}`;

exports.handler = async (event, context) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'post',
      headers: headers,
      body: JSON.stringify({ query: query })
    });
    const data = await response.json();

    // Present a given number as nicely formatted monetary amount.
    const moneyFmt = function (amount) {
      return `€ ${amount.toLocaleString("nl-NL", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    };

    // Rounds a number to two decimal places and returns it as an integer.
    const roundToTwoDecimalPlaces = function (number) {
      return Math.round(number * 100);
    };

    // a frame for each home
    let frames = data.data.viewer.homes.map(function (home) {
      const priceInfo = home.currentSubscription.priceInfo;

      /**
       * 53297 dark red
       * 53296 light red
       * 53229 cyan
       * 53294 light green
       * 53295 dark green
       */
      let icon = 53229;
      switch (priceInfo.current.level) {
        case 'VERY_CHEAP':
          icon = 53297;
          break;
        case 'CHEAP':
          icon = 53296;
          break;
        case 'EXPENSIVE':
          icon = 53295;
          break;
        case 'VERY_EXPENSIVE':
          icon = 53294;
          break;
      }

      const currentHour = new Date();
      currentHour.setMinutes(0, 0, 0); // Set minutes, seconds, and milliseconds to zero

      // Merge all hours
      const futureHours = priceInfo.today.concat(
        priceInfo.tomorrow
      // Remove empty elements
      ).filter(
        day => day !== undefined
      // Keep objects where the start time is greater than or equal to the beginning of the current hour.
      ).filter(
        day => {
          const startTime = new Date(day.startsAt);
          return startTime >= currentHour;
        }
      // Return an array with only the rounded values
      ).map(
        day => roundToTwoDecimalPlaces(day.total)
      );

      // Find the absolute minimum value in the array
      const min = Math.min(...futureHours);

      // Transpose the array so the lowest value is zero
      for (let i = 0; i < futureHours.length; i++) {
        futureHours[i] -= min;
      }

      return [
        {
          "text": moneyFmt(priceInfo.current.total),
          "icon": icon
        },
        {
          "chartData": futureHours
        }
      ]
    });

    // Cache the result until the next hour begins.
    const currentDate = new Date();
    const currentMinutes = currentDate.getMinutes();
    const secondsUntilNextHour = (60 - currentMinutes) * 60;

    return {
      statusCode: 200,
      headers: {
        "Cache-Control": `private, max-age=${secondsUntilNextHour}, must-revalidate`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "frames": frames.flat(1)
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "error": error
      })
    };
  }
};

/**
 * example API response:
 *
 * {
  "data": {
    "viewer": {
      "homes": [
        {
          "currentSubscription": {
            "priceInfo": {
              "current": {
                "total": 0.1016,
                "energy": 0.0018,
                "tax": 0.0998,
                "startsAt": "2023-05-15T14:00:00.000+02:00"
              },
              "today": [
                {
                  "total": 0.2411,
                  "energy": 0.1134,
                  "tax": 0.1277,
                  "startsAt": "2023-05-15T00:00:00.000+02:00"
                }
              ],
              "tomorrow": [
                {
                  "total": 0.1646,
                  "energy": 0.0522,
                  "tax": 0.1124,
                  "startsAt": "2023-05-16T00:00:00.000+02:00"
                }
              ]
            }
          }
        }
      ]
    }
  }
}
 */
```

As you can see, the code does a couple nifty things:

- gets current price, plus today and tomorrow's prices
- creates a LaMetric frame for each of your homes
- filters all prices to only show the current hour onwards
- massages the data so that it fits the display best
- rounds the prices to two decimals
- selects an icon color based on how high the price is
- caches the response

## Step 3. Manage the secret credentials

My code looks for a TIBBER_ACCESS_TOKEN in the server's environment.

No, you can't have mine. ;)

## Step 4. Ship it!

Publish and deploy both the LaMetric app and the server/function.

## Step 5. Almost there

You should have setup your LaMetric Time already using the app. Mine looks like this:

{{< figure src="Screenshot_2023-09-14-14-36-17-77_3a6086b6a1f0f4677cd0daecc29560ca.jpg" >}}

Install your own app onto yours:

{{< figure src="install tibber app on LaMetric Time.jpg" >}}

and presto! Your current energy price should pop up immediately.