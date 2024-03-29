﻿using SpotPicker.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SpotPicker.EFCore
{
    [Table("User")]
    public class User
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(250)]
        public string Username { get; set; }

        [MaxLength(250)]
        public string Password { get; set; }

        [MaxLength(250)]
        public string Name { get; set; }
        [MaxLength(250)]
        public string Surname { get; set; }
        [MaxLength(250)]
        public string Email { get; set; }

        [MaxLength(34)] // duljina ibana je 34
        public string IBAN { get; set; }
        public bool IsEmailConfirmed { get; set; }

        public int RoleID {  get; set; }
        [MaxLength(500)]
        public string? idImagePath { get; set; }

        public virtual Manager Manager { get; set; }

        public virtual Wallet Wallet { get; set; }
        public virtual List<Transaction> Transactions {  get; set; }    

        public virtual List<Reservation> Reservations { get; set; }
    }
}
