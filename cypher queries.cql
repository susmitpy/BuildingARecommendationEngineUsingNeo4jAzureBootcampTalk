// What does a user order most frequently ?
MATCH
(u: User {db_id: 2}) - [ho:HAS_ORDERED] -> (i: Item)
RETURN i, ho.times AS freq
ORDER BY freq DESC
LIMIT 2


// Once a particular item (denoted as X) has been added into the cart, which other items have been previously ordered by the user with item X ?
MATCH
    (u: User {db_id: 3}) - [:HAS_MADE] -> (o:Order)
        - [:HAS_ITEM] -> (:Item {db_id: 4}),
    (o) - [:HAS_ITEM] -> (ai:Item)
RETURN ai as item, count (ai) AS freq
ORDER BY freq DESC
LIMIT 2


// Once a particular item (denoted as X) has been added into the cart, which items are frequently ordered along with X amongst all the users ?
MATCH
    (:Item {db_id:5}) - [oai:ORDERED_ALONG_WITH] - (ai:Item)
RETURN ai AS item, oai.times AS freq
ORDER BY freq DESC
LIMIT 2


// Creating ORDERED_ALONG_WITH Relationships in Bulk while loading data
MATCH (o: Order)
MATCH (o) - [hia: HAS_ITEM] -> (item_a: Item)
MATCH (o) - [hib: HAS_ITEM] -> (item_b: Item)
WHERE
    ID(item_b) < ID(item_a)
MERGE
    (item_a) - [oaw: ORDERED_ALONG_WITH] - (item_b)
ON CREATE SET oaw.times = 1
ON MATCH SET oaw.times = oaw.times + 1;


// Creating / Updating ORDERED_ALONG_WITH Relationship when a user makes a order

UNWIND [[8, 10]] AS items_permu
MATCH (u: User {db_id: 1})
MATCH (ia: Item {db_id: items_permu [0]})
MATCH (ib: Item {db_id: items_permu [1]})
MERGE (ib) - [oaw: ORDERED_ALONG_WITH] - (ia)
ON CREATE SET oaw.times = 1
ON MATCH SET oaw.times = oaw.times + 1;
