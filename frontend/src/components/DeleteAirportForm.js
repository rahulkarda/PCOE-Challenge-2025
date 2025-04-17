"use client"

import { useState } from "react"
import { deleteAirport } from "../services/api"

const DeleteAirportForm = ({ onCancel, onSuccess }) => {
  const [icao, setIcao] = useState("")
  const [error, setError] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!icao) {
      setError("ICAO code is required")
      return
    }

    setIsDeleting(true)
    setError("")

    try {
      await deleteAirport(icao)
      onSuccess()
    } catch (error) {
      console.error("Error deleting airport:", error)
      if (error.response && error.response.status === 404) {
        setError("Airport with this ICAO code not found")
      } else {
        setError("Failed to delete airport. Please try again.")
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Delete Airport</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">ICAO Code*</label>
          <input
            type="text"
            value={icao}
            onChange={(e) => setIcao(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm ${error ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter ICAO code"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isDeleting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Airport"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DeleteAirportForm
