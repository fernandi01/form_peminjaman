// File: form_peminjaman/controller/oliver.js
// KRITIS: Menggunakan angular.module('formApp', []) untuk memastikan modul didefinisikan (setter syntax)
angular.module('formApp', []) 
    .controller('OliverController', ['$scope', '$http', function($scope, $http) {
      $scope.oliverData = {
        ruangan: 'Oliver', // Ruangan Oliver (Gudang) - Tidak bisa diubah
        // Data ini harus dimuat dari localStorage/session setelah login
        nama: 'Nama Pengguna Default',
        subseksi: 'Subseksi Default',
        wa: '08xxxxxx' 
      };
      
      $scope.today = new Date();
      $scope.done = false;
      // Ganti URL_APPS_SCRIPT_OLIVER_INVENTORY dengan URL Apps Script Anda yang baru
      const OLIVER_ENDPOINT = "URL_APPS_SCRIPT_OLIVER_INVENTORY"; 
      
      // ==============================================================
      // Logika Waktu Peminjaman (Sederhana untuk Gudang Oliver)
      // ==============================================================
      $scope.waktuTersedia = [];
      $scope.chosen = false;
      $scope.waiting = false;

      $scope.toggleWaktu = function(waktu) {
        waktu.checked = !waktu.checked;
      };

      $scope.updateDisabledCheckboxes = function() {
        if (!$scope.oliverData.tanggal) return;
        else {
            $scope.waktuTersedia = [];
            $scope.chosen = true;
            $scope.waiting = true;
        }
        
        const allWaktu = [
          "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
          "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00",
          "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00"
        ];
        
        $scope.waktuTersedia = allWaktu.map(w => ({ label: w, checked: false, disabled: false }));
        $scope.waiting = false;
      };


      // Fungsi umum untuk submit form Oliver
      // PERBAIKAN: Menghapus 'extraPayload' dari argumen
      $scope.submitOliverForm = function(formName, actionType) {
        const waktuTerpilih = $scope.waktuTersedia
          .filter(w => w.checked)
          .map(w => w.label);
          
        if (formName.$invalid || waktuTerpilih.length === 0) {
          alert('Mohon lengkapi semua field dan pilih waktu peminjaman ruangan Oliver.');
          return;
        }

        $scope.done = true;
        
        // Gabungkan semua data dari $scope.oliverData (yang sudah diupdate oleh ng-model)
        const payload = Object.assign({}, $scope.oliverData, {
            action: actionType, 
            waktu: waktuTerpilih
        });

        const formEncoded = new URLSearchParams(payload).toString();

        $http({
          method: 'POST',
          url: OLIVER_ENDPOINT,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: formEncoded
        }).then(function success(response) {
          $scope.done = false;
          if (response.data.status === "SUCCESS") {
            alert(`Permintaan ${actionType} berhasil dicatat.`);
            window.location.href = 'home.html'; 
          } else {
            alert(`Gagal mencatat permintaan: ` + response.data.message);
          }
        }, function error() {
          $scope.done = false;
          alert('Gagal mengirim data ke server. Coba lagi nanti.');
        });
      };
    }]);