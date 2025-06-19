# sv-pack-simulator
A script to simulate buying Legends Rise packs in Shadowverse: Worlds Beyond. Count how many packs needed to have the full Legends Rise set (3-of each card in the set) on average.

Assumptions:
- You obtained a starter deck
- You liquefy all extras immediately and you always liquefy premium/animated art cards whenever possible
- You immediately craft the whole set if you have enough vials from the above liquefying procedure

## How to run
Install [node](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), then run `node CardPullSimulator.js`. It will create a file called `trial_results_without_daily_packs.csv`.
Each entry in this file corresponds to the number of card packs you need to buy from the shop in order to have the full collection, assuming the above.

To get the results with daily packs, uncomment the code block inside `runTrial()` for the daily pack simulation and rerun.

## Results
![image](https://github.com/user-attachments/assets/f9ed00c9-1f06-44fa-b468-b969b4bad64e)

You need about 355 packs. 

![image](https://github.com/user-attachments/assets/e0f93c03-2097-41c4-a51c-b9e5bc283c2a)

If you open daily packs for 30 days, you need about 331 instead.
