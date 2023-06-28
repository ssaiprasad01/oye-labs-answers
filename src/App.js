
/*1. Make a api for phone number login*/
 
const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());


const dbConfig = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
};


const pool = mysql.createPool(dbConfig);


app.post('/api/add_customer', (req, res) => {
  try {
    
    const { phone_number } = req.body;

   
    if (!phone_number) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }

    
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('MySQL Connection Error:', err);
        return res.status(500).json({ error: 'Failed to connect to the database.' });
      }

      
      connection.beginTransaction((err) => {
        if (err) {
          console.error('MySQL Begin Transaction Error:', err);
          return res.status(500).json({ error: 'An error occurred while adding the customer.' });
        }

        
        connection.query('SELECT COUNT(*) AS count FROM customers WHERE phone_number = ?', [phone_number], (err, results) => {
          if (err) {
            console.error('MySQL Query Error:', err);
            return rollbackAndRelease(connection, res, 500, 'An error occurred while adding the customer.');
          }

          const count = results[0].count;

          if (count > 0) {
            return rollbackAndRelease(connection, res, 400, 'Phone number already exists.');
          }

          
          connection.query('INSERT INTO customers (phone_number) VALUES (?)', [phone_number], (err) => {
            if (err) {
              console.error('MySQL Query Error:', err);
              return rollbackAndRelease(connection, res, 500, 'An error occurred while adding the customer.');
            }

            
            connection.commit((err) => {
              if (err) {
                console.error('MySQL Commit Error:', err);
                return rollbackAndRelease(connection, res, 500, 'An error occurred while adding the customer.');
              }

              releaseConnection(connection);
              return res.json({ message: 'Customer added successfully.' });
            });
          });
        });
      });
    });
  } catch (err) {
    console.error('Unexpected Error:', err);
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});


function rollbackAndRelease(connection, res, status, errorMessage) {
  connection.rollback((err) => {
    if (err) {
      console.error('MySQL Rollback Error:', err);
    }
    releaseConnection(connection);
    return res.status(status).json({ error: errorMessage });
  });
}


function releaseConnection(connection) {
  connection.release();
}


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


/* 2 2. Refer to the tables below, Write a sql query for finding the subjects for each
student, */


SELECT c.customerId, c.name, GROUP_CONCAT(s.subjectName ORDER BY s.subjectName ASC SEPARATOR ',') AS subjects
FROM customers c
JOIN mapping m ON c.customerId = m.customerId
JOIN Subjects s ON m.subjectId = s.subjectId
GROUP BY c.customerId, c.name;



/* 3. Write a function in node that inserts the following data in mysql*/


const mysql = require('mysql');

const customers = [
  { email: "anurag11@yopmail.com", name: "anurag" },
  { email: "sameer11@yopmail.com", name: "sameer" },
  { email: "ravi11@yopmail.com", name: "ravi" },
  { email: "akash11@yopmail.com", name: "akash" },
  { email: "anjali11@yopmail.com", name: "anjali" },
  { email: "santosh11@yopmail.com", name: "santosh" }
];


const dbConfig = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
};


const pool = mysql.createPool(dbConfig);

function insertCustomers(customers) {
  customers.forEach((customer) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('MySQL Connection Error:', err);
        return;
      }

     
      connection.query('SELECT customerId FROM customers WHERE email = ?', [customer.email], (err, results) => {
        if (err) {
          console.error('MySQL Query Error:', err);
          releaseConnection(connection);
          return;
        }

        if (results.length > 0) {
          
          connection.query('UPDATE customers SET name = ? WHERE email = ?', [customer.name, customer.email], (err) => {
            if (err) {
              console.error('MySQL Query Error:', err);
            }
            releaseConnection(connection);
          });
        } else {
          
          connection.query('INSERT INTO customers (name, email) VALUES (?, ?)', [customer.name, customer.email], (err) => {
            if (err) {
              console.error('MySQL Query Error:', err);
            }
            releaseConnection(connection);
          });
        }
      });
    });
  });
}


function releaseConnection(connection) {
  connection.release();
}


insertCustomers(customers);



/*4.Create a new object which have all the properties of object person and student*/


const person = {
  id: 2,
  gender: 'mail'
};

const student = {
  name: "ravi",
  email: "ravi11@yopmail.com"
};

const mergedObject = {
  ...person,
  ...student
};

console.log(mergedObject);



/* 5.Make a promisifed function for the functioan having callback below*/

const request = require('request');

function getGoogleHomePageAsync() {
  return new Promise((resolve, reject) => {
    request('http://www.google.com', function (error, response, body) {
      if (error) {
        console.error('error:', error);
        reject(error);
      } else {
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
        resolve(body);
      }
    });
  });
}

getGoogleHomePageAsync()
  .then(result => {
    console.log("RESULT==>", result);
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });



  /* 6.array of integer from 1 to 100 */

  const numbers = [1, 2, 4, 5, /* ... */ 100]; 

function findMissingNumber(numbers) {
  const expectedSum = (100 * 101) / 2; 

  const sum = numbers.reduce((accumulator, currentNumber) => accumulator + currentNumber, 0);

  const missingNumber = expectedSum - sum;

  return missingNumber;
}

const missingNumber = findMissingNumber(numbers);
console.log("Missing number:", missingNumber);


