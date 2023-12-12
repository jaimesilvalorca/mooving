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
        const { userEmail } = req.body
        const { driverEmail,estado } = req.body;

        console.log(estado)


        const updatedTrip = await TripModel.findOneAndUpdate(
            { userEmail: userEmail },
            { driverEmail: driverEmail,estado:estado},
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

export const fetchPendingTrip = async (req, res) => {
    try {
      const { driverEmail } = req.params;
  
      const pendingTrip = await TripModel.findOne({
        driverEmail: driverEmail,
        estado: 'enviado',
      });
  
      if (!pendingTrip) {
        return res.status(404).json({
          success: false,
          message: 'Viaje pendiente no encontrado',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Viaje pendiente encontrado correctamente',
        data: pendingTrip,
      });
    } catch (error) {
      console.error('Error al buscar el viaje pendiente:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error,
      });
    }
  };

  export const cancelTrip = async (req, res) => {
    const { tripId } = req.params;
  
    try {
      const canceledTrip = await TripModel.findByIdAndUpdate(tripId, { estado: 'cancelado' }, { new: true });
  
      if (!canceledTrip) {
        return res.status(404).json({
          success: false,
          message: 'Viaje no encontrado',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Viaje cancelado correctamente',
        data: canceledTrip,
      });
    } catch (error) {
      console.error('Error al cancelar el viaje:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error,
      });
    }
  };

  export const acceptTrip = async (req, res) => {
    const { tripId } = req.params;
  
    try {
      const canceledTrip = await TripModel.findByIdAndUpdate(tripId, { estado: 'aceptado' }, { new: true });
  
      if (!canceledTrip) {
        return res.status(404).json({
          success: false,
          message: 'Viaje no encontrado',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Viaje aceptado correctamente',
        data: canceledTrip,
      });
    } catch (error) {
      console.error('Error al cancelar el viaje:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error,
      });
    }
  };

  export const completeTrip = async (req, res) => {
    const { tripId } = req.params;
  
    try {
      const canceledTrip = await TripModel.findByIdAndUpdate(tripId, { estado: 'completado' }, { new: true });
  
      if (!canceledTrip) {
        return res.status(404).json({
          success: false,
          message: 'Viaje no encontrado',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Viaje completado correctamente',
        data: canceledTrip,
      });
    } catch (error) {
      console.error('Error al cancelar el viaje:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error,
      });
    }
  };

  export const getTripById = async (req, res) => {
    const { tripId } = req.params;
  
    try {
      const trip = await TripModel.findById(tripId);
  
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Viaje no encontrado',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Viaje encontrado correctamente',
        data: trip,
      });
    } catch (error) {
      console.error('Error al obtener el viaje por ID:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error,
      });
    }
  };

  