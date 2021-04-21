﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DATA
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class VolunteerMatchDbContext : DbContext
    {
        public VolunteerMatchDbContext()
            : base("name=VolunteerMatchDbContext")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<ChatHistory> ChatHistories { get; set; }
        public virtual DbSet<Comment> Comments { get; set; }
        public virtual DbSet<Favorite> Favorites { get; set; }
        public virtual DbSet<FeedSetting> FeedSettings { get; set; }
        public virtual DbSet<Gender> Genders { get; set; }
        public virtual DbSet<Hobby> Hobbies { get; set; }
        public virtual DbSet<Interaction> Interactions { get; set; }
        public virtual DbSet<InteractionsMember> InteractionsMembers { get; set; }
        public virtual DbSet<Like> Likes { get; set; }
        public virtual DbSet<Location> Locations { get; set; }
        public virtual DbSet<Meeting> Meetings { get; set; }
        public virtual DbSet<Member> Members { get; set; }
        public virtual DbSet<MembersCategory> MembersCategories { get; set; }
        public virtual DbSet<MembersHobby> MembersHobbies { get; set; }
        public virtual DbSet<MembersPost> MembersPosts { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<Post> Posts { get; set; }
        public virtual DbSet<Review> Reviews { get; set; }
        public virtual DbSet<WhereActivity> WhereActivities { get; set; }
    }
}
