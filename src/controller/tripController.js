import TripModel from '../models/tripModel.js';

export const createTrip = async (req, res) => {
    try {
        const { email, origin, destination, latitude, longitude, distance, amount } = req.body;
        const newTrip = new TripModel({
            email,
            origin,
            destination,
            latitude,
            longitude,
            distance,
            amount,
            estado
        });

        const data = {
            email: newTrip.email,
            origin: newTrip.origin,
            destination: newTrip.destination,
            latitude: newTrip.latitude,
            longitude: newTrip.longitude,
            distance: newTrip.distance,
            amount: newTrip.amount,
            estado: newTrip.estado
        }

        const savedTrip = await newTrip.save();

        res.status(200).json({
            success: true,
            message: 'Viaje guardado correctamente',
            error: data
        });
    } catch (error) {
        console.error('Error al crear el viaje:', error);
        res.status(500).json({
             success:false,
             message: 'Error interno del servidor',
             error:error 
            });
    }
};

export default { createTrip };
