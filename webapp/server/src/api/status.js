var status = '';

module.exports = {
    setStatus: function (newStatus) {
        this.status = newStatus;
    },

    getStatus: function () {
        return this.status;
    },
};