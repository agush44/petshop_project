import Service from "../models/service.js";

const getServices = async (req, res) => {
  try {
    const services = await Service.find({ active: true });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services" });
  }
};

const getAllServicesAdmin = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services" });
  }
};

const createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Error creating service" });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Error updating service" });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting service" });
  }
};

export {
  getServices,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
};
