angular.module('formApp', [])
    .controller('FormController', ['$scope', '$http', '$filter', function($scope, $http, $filter) {
      $scope.formData = {};
      $scope.today = new Date();
      $scope.waktuTersedia = [];
      $scope.chosen = false;
      $scope.done = false;

      $scope.toggleWaktu = function(waktu) {
        waktu.checked = !waktu.checked;
      };

      $scope.submitForm = function() {
        $scope.done = true;

        const waktuTerpilih = $scope.waktuTersedia
          .filter(w => w.checked)
          .map(w => w.label);

        if ($scope.bookingForm.$invalid || waktuTerpilih.length === 0) {
          alert('Mohon lengkapi semua field dan pilih waktu.');
          return;
        }

        const payload = Object.assign({}, $scope.formData);
        payload.waktu = waktuTerpilih;

        const formEncoded = new URLSearchParams(payload).toString();

        const endpoint = "https://script.google.com/macros/s/AKfycbwk3iGg8luuMUahGj-GdwP3bZVmntvS_Snh5Hk0M1-3UAKzfoptPjUS7K1fdteBvwQFeg/exec";

        $http({
          method: 'POST',
          url: endpoint,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: formEncoded
        }).then(function success() {

          const msg =
            `Halo PIC Ruangan,%0A` +
            `Saya ingin mengajukan peminjaman ruangan:%0A%0A` +
            `Nama: ${payload.nama}%0A` +
            `Subseksi: ${payload.subseksi}%0A` +
            `Ruangan: ${payload.ruangan}%0A` +
            `Tanggal: ${payload.tanggal}%0A` +
            `Waktu: ${payload.waktu.join(', ')}%0A` +
            `WA: ${payload.wa}%0A` +
            `Alasan: ${payload.Alasan}%0A%0A` +
            `Mohon konfirmasi dan bantuannya untuk akses smart door. Terima kasih.`;

          window.location.href = `https://wa.me/6281398666336?text=${msg}`;
        }, function error() {
          alert('Gagal mengirim data.');
        });
      };

      $scope.updateDisabledCheckboxes = function() {
        if (!$scope.formData.tanggal || !$scope.formData.ruangan) return;
        else {
            $scope.waktuTersedia = [];
            $scope.chosen = true;
            $scope.waiting = true;
        }

        $http.get('https://script.google.com/macros/s/AKfycbwk3iGg8luuMUahGj-GdwP3bZVmntvS_Snh5Hk0M1-3UAKzfoptPjUS7K1fdteBvwQFeg/exec')
          .then(function(res) {
            const booked = res.data;
            console.log(booked);
            const allWaktu = [
              "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
              "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00",
              "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00"
            ];

            const selectedDate = new Date($scope.formData.tanggal).toDateString();
            const selectedRoom = $scope.formData.ruangan;

            let waktuTerpakai = [];

            booked.forEach(entry => {
            const entryDate = new Date(entry.tanggal).toDateString();
            if (entryDate === selectedDate && entry.ruangan === selectedRoom) {
                if (entry.waktu.length > 0) {
                const timeStr = entry.waktu[0];
                const times = timeStr.split(',').map(t => t.trim());
                waktuTerpakai = waktuTerpakai.concat(times);
                }
            }
            });

            const waktuTersisa = allWaktu.filter(w => !waktuTerpakai.includes(w));

            $scope.waktuTersedia = waktuTersisa.map(w => ({
            label: w,
            checked: false
            }));
            $scope.waiting = false;
        });
      };
    }]);