var query = {

	message: function(message) {

		switch(message) {
			case 'failed':
				return "Could not save changes";
			break;

			case 'new':
				return "Succesfully uploaded new image";
			break;

			case 'edit':
				return "Succesfully edited image";
			break;

			case 'delete':
				return "Succesfully deleted image";
			break;

			default: 
				return;
		}

	}
}

module.exports = query;