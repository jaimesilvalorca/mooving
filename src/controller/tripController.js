import TripModel from '../models/tripModel.js';

export const createTrip = async (req, res) => {
    try {
        const { userEmail,driverEmail, origin, destination, originLatitude, originLongitude,destinationLatitude, destinationLongitude, distance, amount,estado } = req.body;
        const newTrip = new TripModel({
            userEmail,
            driverEmail,
            origin,
            destination,
            originLatitude, 
            originLongitude,
            destinationLatitude, 
            destinationLongitude,
            distance,
            amount,
            estado
        });

        const data = {
            userEmail: newTrip.userEmail,
            driverEmail:newTrip.driverEmail,
            origin: newTrip.origin,
            destination: newTrip.destination,
            originLatitude: newTrip.originLatitude, 
            originLongitude: newTrip.originLongitude,
            destinationLatitude: newTrip.destinationLatitude, 
            destinationLongitude: newTrip.destinationLongitude,
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

export const updateTripDriver = async (req, res) => {
    try {
        const { userEmail } = req.body;  // Obtén userEmail del cuerpo de la solicitud
        const { driverEmail } = req.body;
        const {estado} = req.body

        const updatedTrip = await TripModel.findOneAndUpdate(
            { userEmail: userEmail },
            { driverEmail: driverEmail},
            {estado:estado}
            { new: true }
        );

        if (!updatedTrip) {
            return res.status(404).json({
                success: false,
                message: 'Viaje no encontrado',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Conductor asociado al viaje correctamente',
            data: updatedTrip,
        });
    } catch (error) {
        console.error('Error al asociar el conductor al viaje:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error,
        });
    }
};