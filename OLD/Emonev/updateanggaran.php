<?php


$host		='localhost';
$username	='monevrkpd';
$password	='heriprihanto140286';
$database	='dalev2024';
$dsn        = "pgsql:host=$host;dbname=$database";
$options    = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION);
//$pdo = new PDO($dsn, $username, $password, $options);

$dbfile = "sipdri2024.db3";
//$pdo = new PDO("sqlite:" . $dbfile . "");
try {
    //$pdo = new PDO("sqlite:" . $dbfile . "");
    //echo "KONEK";
    $pdo = new PDO($dsn, $username, $password, $options);
}
catch(PDOException $e) { echo $e->getMessage();die();}


$stmtr = $pdo->prepare("SELECT * from sipd.sipd_ri_ta_subkegiatan where tahun=2024 and idtahap=2");
$stmtr->execute(); 
$rdata = $stmtr->fetchAll();

foreach ($rdata as $rd){
    echo $rd['nama_sub_giat'];
    $anggaran=floatval($rd['rincian']);
    $idsubkegiatan=intval($rd['id_sub_bl']);    
    $pdo->exec("update public.ta_renja_subkegiatan set anggaran=$anggaran, anggaran_geser=$anggaran where id_subkegiatan=$idsubkegiatan;");
    echo $anggaran;
}
