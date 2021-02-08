﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DATA;
using WebApi.DTO;

namespace WebApi.Controllers
{
    public class MemberController : ApiController
    {
        // GET api/<controller>
        public string Get()
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            Member member = db.Members.SingleOrDefault(x => x.fullName == "alan skverer");
            MemberDTO memberDTO = new MemberDTO();
            memberDTO.name = "My email is: "+member.email;
            return memberDTO.name;
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value test github!!!!";
        }

        // POST api/<controller>
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}