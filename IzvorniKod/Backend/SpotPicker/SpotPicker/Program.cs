using SpotPicker.EFCore;
using Microsoft.EntityFrameworkCore;
using SpotPicker.Services;

var corsorgin = "_mycorsorigin";
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: corsorgin,
        policy =>
        {
            policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod();
        });
});

builder.Services.AddDbContext<_EFCore>(
    o => o.UseNpgsql(builder.Configuration.GetConnectionString("SpotPickerDatabase")));

builder.Services.AddScoped<IEmailService, EmailService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(corsorgin);

app.UseAuthorization();

app.MapControllers();

app.Run();
