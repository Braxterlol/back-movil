import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
};

const pool = mysql.createPool(config);

export async function query(sql: string, params: any[]) {

    try {
        const conn = await pool.getConnection();
        console.log('La conexion a la bd fue exitosa');
        const result = await conn.execute(sql, params);
        conn.release();
        return result;
    } catch ( error ){
        console.log('hubo un error al crear la conexion', error);
        return null;
    }   
}